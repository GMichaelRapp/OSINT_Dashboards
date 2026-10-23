#!/usr/bin/env node
/*
 * Tests for the OSINT Dashboard Builder.
 *
 * Run from the repository root with:  node Tests/run.js
 * Needs Node 18 or later and nothing else. It reads index.html, pulls out the
 * citation formatter, the source tables and the dashboard model, and checks
 * that known inputs still give the expected results.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
function block(id) {
  const m = html.match(new RegExp('<script id="' + id + '">([\\s\\S]*?)</script>'));
  if (!m) { console.error('Could not find <script id="' + id + '"> in index.html'); process.exit(1); }
  return m[1];
}
const [O, T, DB, GEO] = new Function(block('core') + block('tables') + block('geo') + block('db-core') + ';return [OSINT, OSINT_TABLES, DB, WORLD_GEO];')();
const lib = {}; T.LIB.forEach((c) => c.g.forEach((g) => g.i.forEach((x) => { lib[x.toLowerCase()] = {}; })));
O.setLibrary(lib);
let failed = 0, passed = 0;
function eq(got, want, label) { const g = JSON.stringify(got), w = JSON.stringify(want); if (g === w) { passed++; return; } failed++; console.log('FAIL  ' + label + '\n  got : ' + g + '\n  want: ' + w); }
function ok(c, label) { eq(!!c, true, label); }

// ---- 1. Values ----
[['1,234', 1234], ['$5', 5], ['(12)', -12], ['3.5%', 3.5], ['1e3', 1000], ['abc', null], ['', null]].forEach(([r, w]) => eq(DB.num(r), w, 'num ' + r));
[['2013', '2013'], ['2013-10', '2013-10'], ['10/1/2013', '2013-10-01'], ['1 October 2013', '2013-10-01'], ['Oct 1, 2013', '2013-10-01'], ['2013-02-30', ''], ['2013-10-01T12:00:00Z', '2013-10-01']].forEach(([r, w]) => eq(DB.normDate(r), w, 'normDate ' + r));
eq(DB.fmt(213888103, 'compact'), '214M', 'compact millions');
eq(DB.fmt(1530252, 'full'), '1,530,252', 'full with commas');
eq(DB.fmt(12900, 'compact'), '12.9K', 'compact thousands keep one decimal under 100');
eq(DB.niceTicks(0, 144000, 5), [0, 50000, 100000, 150000], 'nice ticks');

// ---- 2. Reading a CSV ----
let r = DB.datasetFromCSV('Name,Lat,Longitude,When,Amount,source_id,Page\nA,1.5,2,1 Oct 2013,"1,200",s1,p. 3\nB,3,4,2013-11-02,$5,s2,p. 4\n', 'x');
eq(r.dataset.columns.map((c) => c.type), ['text', 'lat', 'lon', 'date', 'number', 'source', 'locator'], 'column types guessed');
eq(r.dataset.rows[0], ['A', 1.5, 2, '2013-10-01', 1200, 's1', 'p. 3'], 'values coerced');
r = DB.datasetFromCSV('a\tb\n1\t2\n', 't'); eq(r.dataset.rows, [[1, 2]], 'tab-separated read');
ok(DB.datasetFromCSV('only,a,header\n', 'x').error, 'a CSV with no rows is refused');

// ---- 3. Aggregation ----
const ds = { columns: [{ key: 'd', type: 'date' }, { key: 'k', type: 'text' }, { key: 'v', type: 'number' }],
  rows: [['2020-01-05', 'a', 1], ['2020-01-20', 'b', 2], ['2020-03-02', 'a', 3], ['2020-03-09', 'a', null]] };
let ot = DB.overTime(ds, { x: 'd', op: 'count', bucket: 'month' });
eq(ot.labels, ['Jan 2020', 'Feb 2020', 'Mar 2020'], 'empty months filled in');
eq(ot.series[0].values, [2, 0, 2], 'counts per month');
ot = DB.overTime(ds, { x: 'd', y: 'v', op: 'sum', bucket: 'month', series: 'k' });
eq(ot.series.map((s) => [s.label, s.values]), [['a', [1, 0, 3]], ['b', [2, 0, 0]]], 'sum per month per series');
eq(DB.byCategory(ds, { cat: 'k', op: 'count', sort: 'desc' }).map((x) => [x.label, x.value]), [['a', 3], ['b', 1]], 'count by category');
eq(DB.byCategory(ds, { cat: 'k', y: 'v', op: 'avg' }).map((x) => x.value), [2, 2], 'average ignores blanks');
eq(DB.byCategory(ds, { cat: 'k', op: 'count', top: 1 }).map((x) => x.label), ['a', 'Other (1)'], 'top N folds into Other');
eq(DB.statValue(ds, { op: 'sum', col: 'v', filterCol: 'k', filterVal: 'a' }), 4, 'filtered sum');
eq(DB.statValue(ds, { op: 'latest', col: 'v' }), null, 'latest value by date');
const many = { columns: ds.columns, rows: 'abcdefghij'.split('').map((k, i) => ['2020-01-0' + ((i % 9) + 1), k, i]) };
ok(DB.overTime(many, { x: 'd', op: 'count', bucket: 'month', series: 'k' }).series.length <= DB.MAX_SERIES, 'never more than eight series');

// ---- 4. Footnotes come from the Citation Generator's formatter ----
const court = { type: 'archival', authors: 'US District Court for the Southern District of New York', title: 'Opinion and Order', titleStyle: 'quotes', location: 'United States v. Ulbricht, No. 14-cr-68 (S.D.N.Y.)', descType: 'Court Opinion', descDetails: 'ECF No. 89', date: '2014-10-10', access: [], quals: [] };
eq(O.toMarkdown(O.build(DB.sourceState(T.TYPES, T.TEXT_KEYS, court, '5')).seg), 'US District Court for the Southern District of New York, "Opinion and Order," *United States v. Ulbricht, No. 14-cr-68 (S.D.N.Y.)* [Court Opinion; ECF No. 89] (10 October 2014): p. 5.', 'court opinion footnote');

// ---- 5. The example ----
const ex = JSON.parse(fs.readFileSync(path.join(root, 'examples', 'silk-road-dashboard.json'), 'utf8'));
r = DB.normalize(ex, T.TEXT_KEYS);
eq(r.fixes, [], 'example opens without repairs');
const p = r.project;
eq(DB.audit(p, O, T.TYPES, T.TEXT_KEYS).rows.filter((x) => x.level === 'fix').length, 0, 'example has nothing to fix');
ok(p.panels.every((x) => p.sections.some((s) => s.id === x.section)), 'every panel is in a section');
ok(p.disputes.every((d) => d.refs.every((id) => p.panels.some((x) => x.id === id))), 'every dispute points to real panels');
const btc = p.datasets.find((d) => d.id === 'd2');
ok(DB.rowCites(btc).every((c) => c.src && c.loc && c.quote), 'every bitcoin row carries a source, locator and quote');

// ---- 6. Checks ----
const bad = DB.normalize({ sources: [], datasets: [{ id: 'd1', name: 'X', columns: [{ key: 'a', type: 'text' }], rows: [['1']] }], panels: [{ id: 'p1', type: 'bar', dataset: 'd1', cfg: {} }, { id: 'p2', type: 'stat', cfg: { mode: 'manual', value: '5' } }], disputes: [{ title: 'z', refs: ['p9'] }] }, T.TEXT_KEYS).project;
const msgs = DB.audit(bad, O, T.TYPES, T.TEXT_KEYS).rows.map((x) => x.level + ': ' + x.msg);
ok(msgs.some((m) => /^fix: Data "X" has no citation/.test(m)), 'flags data with no citation');
ok(msgs.some((m) => /^fix: Panel p1 .*needs a column for cat/.test(m)), 'flags a chart with no category column');
ok(msgs.some((m) => /^fix: Panel p2 .*figure with no citation/.test(m)), 'flags a typed figure with no citation');
ok(msgs.some((m) => /^fix: Dispute "z" points to p9/.test(m)), 'flags a dispute pointing nowhere');

// ---- 7. The page ----
ok(GEO.land.length > 10000 && /^M-?\d/.test(GEO.land), 'map outlines are embedded');
const boot = JSON.parse(html.match(/<script type="application\/json" id="db-data">([\s\S]*?)<\/script>/)[1]);
eq(boot.mode, 'builder', 'page starts in builder mode');
ok(DB.normalize(boot.project, T.TEXT_KEYS).project.panels.length > 0, 'page ships with the sample dashboard');

console.log((failed ? 'FAILED ' : 'All passed: ') + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
