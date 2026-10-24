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

// ---- 8. Version 1.1: layout, chart data, editing rows, maps ----
const v1 = DB.normalize({ panels: [{ id: 'a', type: 'stat', width: 1 }, { id: 'b', type: 'bar', width: 2 }, { id: 'c', type: 'text', width: 3, cfg: { text: 'x' } }] }, T.TEXT_KEYS).project;
eq(v1.panels.map((x) => x.span), [4, 8, 12], 'widths in thirds become spans in twelfths');
eq(DB.normalize({ format: 2, panels: [{ id: 'a', type: 'stat', span: 1 }, { id: 'b', type: 'bar', span: 4 }, { id: 'c', type: 'map', span: 6 }] }, T.TEXT_KEYS).project.panels.map((x) => x.span), [2, 8, 12], 'format 2 spans in sixths are doubled');
eq(DB.normalize({ format: 3, panels: [{ id: 'a', type: 'stat', span: 3 }, { id: 'b', type: 'bar', span: 9 }, { id: 'c', type: 'bar', span: 7 }] }, T.TEXT_KEYS).project.panels.map((x) => x.span), [3, 9, 6], 'format 3 spans stay, odd ones snap to a width the tool offers');
eq(DB.normalize({ format: 2, panels: [{ id: 'a', type: 'bar', span: 4, tall: true }, { id: 'b', type: 'bar', rows: 3 }, { id: 'c', type: 'bar', rows: 7, frame: 'odd' }] }, T.TEXT_KEYS).project.panels.map((x) => [x.rows, x.frame]), [[2, ''], [3, ''], [1, '']], 'tall becomes two rows; bad rows and frames fall back');
eq(v1.panels[2].cfg.look, 'plain', 'text panels get a look');
eq(DB.normalize({ panels: [{ id: 'a', type: 'pie', span: 3 }] }, T.TEXT_KEYS).project.panels[0].width, 2, 'a half-width panel still has a width older versions read');
eq(v1.style, DB.blankStyle(), 'a file with no style gets the default look');
eq(DB.normalize({ panels: [], style: { accent: '#abc', cards: 'flat', width: 'huge' } }, T.TEXT_KEYS).project.style.accent, '#AABBCC', 'accent colors are tidied');
eq(DB.normalize({ panels: [], style: { width: 'huge' } }, T.TEXT_KEYS).project.style.width, 'normal', 'unknown style values fall back');
const sp = { columns: [{ key: 'y', type: 'text' }, { key: 'r', type: 'text' }, { key: 'v', type: 'number' }], rows: [['2020', 'N', 1], ['2020', 'S', 2], ['2021', 'N', 3], ['2021', 'N', 4]] };
let st = DB.byCategorySplit(sp, { cat: 'y', split: 'r', op: 'sum', y: 'v', sort: 'data' });
eq(st.cats.map((c) => [c.label, c.total]), [['2020', 3], ['2021', 7]], 'split bars: totals per category');
eq(st.series.map((s) => [s.label, s.values]), [['N', [1, 7]], ['S', [2, 0]]], 'split bars: one series per part, zero where missing');
eq(DB.byCategorySplit(sp, { cat: 'y', split: 'r', op: 'sum', y: 'v', sort: 'desc' }).cats.map((c) => c.label), ['2021', '2020'], 'split bars sort by total');
const sc = DB.scatterPoints({ columns: [{ key: 'x', type: 'number' }, { key: 'y', type: 'number' }, { key: 'd', type: 'date' }], rows: [[1, 2, '2020-01-01'], [2, 4, '2021'], [3, 6, ''], [null, 1, '']] }, { x: 'x', y: 'y' });
eq(sc.length, 3, 'scatter drops rows missing a number');
const tr = DB.trend(sc); ok(Math.abs(tr.b - 2) < 1e-9 && Math.abs(tr.a) < 1e-9 && Math.abs(tr.r2 - 1) < 1e-9, 'trend line through a straight line');
eq(DB.scatterPoints({ columns: [{ key: 'd', type: 'date' }, { key: 'y', type: 'number' }], rows: [['2020-02', 5]] }, { x: 'd', y: 'y' })[0].x, Date.UTC(2020, 1, 1), 'scatter reads dates on the x axis');
const ed = { columns: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'n', label: 'Count', type: 'number' }], rows: [] };
DB.addRow(ed); DB.setCell(ed, 0, 'n', '1,200'); eq(ed.rows[0], ['', 1200], 'typed cells are read like CSV values');
DB.addColumn(ed, 'When', 'date'); eq(ed.columns.map((c) => c.key), ['name', 'n', 'when'], 'a new column gets a key');
DB.moveColumn(ed, 'when', -1); eq(ed.columns.map((c) => c.key), ['name', 'when', 'n'], 'columns move');
eq(ed.rows[0], ['', '', 1200], 'cells move with their column');
let ap = DB.appendCSV(ed, 'Name\tCount\tExtra\nA\t5\tz\n'); eq([ap.added, ap.unknown, ed.rows[1]], [1, ['Extra'], ['A', '', 5]], 'pasted rows match columns by name');
DB.removeColumn(ed, 'when'); eq(ed.rows[1], ['A', 5], 'a deleted column takes its cells');
const mp = DB.normalize({ sources: [{ id: 's1', fields: { type: 'web', title: 'T', authors: 'A', location: 'L' } }], maps: [{ id: 'm1', name: 'M', project: { features: [{ id: 'f1', kind: 'point', label: 'X', cites: [{ src: 's9' }] }] } }], panels: [{ id: 'p1', type: 'map', title: 'Map', cfg: { from: 'map', map: 'm1' } }, { id: 'p2', type: 'map', title: 'Map', cfg: { from: 'map', map: 'm9' } }] }, T.TEXT_KEYS).project;
const mm = DB.audit(mp, O, T.TYPES, T.TEXT_KEYS).rows.map((x) => x.level + ': ' + x.msg);
ok(mm.some((m) => /^fix: Panel p1 .*map feature "X" cites s9/.test(m)), 'a Map Builder map\'s citations are checked');
ok(mm.some((m) => /^fix: Panel p2 .*shows no map/.test(m)), 'flags a map panel with no map');
const MAPC = new Function(block('map-core') + ';return MAPC;')();
ok(MAPC.normalize({ features: [{ kind: 'point', coords: [[1, 2]] }] }, T.TEXT_KEYS).project.features.length === 1, 'the Map Builder\'s map model is built in');
ok(/var MIL_NAMES = \{/.test(block('mil-names')), 'military symbol names are built in for map keys');
ok(/integrity="|el\.integrity = L\.sri/.test(block('app')), 'map libraries load with integrity checks');
ok(p.panels.some((x) => x.type === 'map' && x.cfg.base && x.cfg.base !== 'svg'), 'the example\'s map uses a real basemap');

// ---- 7. Media ----
eq(DB.videoLink('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1m5s'), { host: 'youtube', id: 'dQw4w9WgXcQ', start: 65, label: 'YouTube' }, 'YouTube watch link with a start time');
eq(DB.videoLink('https://youtu.be/dQw4w9WgXcQ').id, 'dQw4w9WgXcQ', 'YouTube short link');
eq(DB.videoLink('https://www.youtube.com/shorts/dQw4w9WgXcQ').id, 'dQw4w9WgXcQ', 'YouTube Shorts link');
eq([DB.videoLink('https://vimeo.com/76979871/abc123def').id, DB.videoLink('https://vimeo.com/76979871/abc123def').hash], ['76979871', 'abc123def'], 'Vimeo link with a private hash');
eq(DB.videoLink('https://archive.org/details/some_item').host, 'archive', 'Internet Archive item');
eq(DB.videoLink('media/clip.mp4').host, 'file', 'a video file next to the page');
eq(DB.videoLink('https://example.org/page'), null, 'a page is not a video');
eq(DB.audioLink('media/call.mp3').url, 'media/call.mp3', 'a sound file next to the page');
eq(DB.embedLink('https://open.spotify.com/episode/4rOoJ6Egrf8K2IrywzwOMk?si=x').url, 'https://open.spotify.com/embed/episode/4rOoJ6Egrf8K2IrywzwOMk', 'Spotify share link becomes its embed');
eq(DB.embedLink('https://public.flourish.studio/visualisation/123456/').url, 'https://flo.uri.sh/visualisation/123456/embed', 'Flourish link becomes its embed');
eq(DB.embedLink('https://www.datawrapper.de/_/AbC12/').url, 'https://datawrapper.dwcdn.net/AbC12/', 'Datawrapper link becomes its embed');
eq(DB.embedLink('http://example.org'), null, 'embeds need https');
[['75', 75], ['1:15', 75], ['1:02:03', 3723], ['1m15s', 75], ['2h', 7200], ['soon', null]].forEach(([v, w]) => eq(DB.parseTime(v), w, 'time ' + v));
eq(DB.fmtTime(3723), '1:02:03', 'times are shown as h:mm:ss');
eq(['https://x.org/a.jpg', 'media/a.jpg', 'javascript:alert(1)', '../secret.jpg', '/abs.jpg', '//x.org/a.jpg', 'data:text/html;base64,AAAA'].map((u) => DB.mediaSrc(u, '')), ['https://x.org/a.jpg', 'media/a.jpg', '', '', '', '', ''], 'only safe picture addresses are kept');
const big = 'data:image/jpeg;base64,' + 'A'.repeat(300000);
eq(DB.mediaSrc(big, '').length, big.length, 'pictures kept inside the dashboard are not cut short');
eq(DB.mediaSrc(big, 'av'), '', 'video and sound are never kept inside the dashboard');
const med = DB.normalize({ format: 3, sources: [{ id: 's1', fields: { type: 'web', title: 'T', descType: 'Photo', url: 'https://x.org' } }], panels: [
  { id: 'm1', type: 'media', cfg: { kind: 'compare', items: [{ src: 'media/a.jpg', alt: 'a', cite: { src: 's1' } }] } },
  { id: 'm2', type: 'media', cfg: { kind: 'video', items: [{ src: 'https://example.org/nope', credit: 'Someone' }], moments: [{ t: '1:30', label: 'b' }, { t: '0:10', label: 'a' }, { t: 'x' }] } },
  { id: 'm3', type: 'media', cfg: { kind: 'gallery', items: [{ src: 'https://x.org/1.jpg' }] }, cites: [{ src: 's1' }] }] }, T.TEXT_KEYS).project;
eq(med.panels[0].cfg.items.length, 2, 'a before-and-after always has two pictures');
eq(med.panels[1].cfg.moments.map((m) => m.t), [10, 90], 'key moments are sorted and bad times dropped');
const mrows = DB.audit(med, O, T.TYPES, T.TEXT_KEYS).rows.map((x) => x.level + ': ' + x.msg);
ok(mrows.some((m) => /^fix: Panel m1, after picture has no picture/.test(m)), 'flags a missing after picture');
ok(mrows.some((m) => /^check: Panel m1 uses a file that must sit next to the published page: media\/a\.jpg/.test(m)), 'lists files that must sit next to the page');
ok(mrows.some((m) => /^fix: Panel m2.*not one the tool can play/.test(m)), 'flags a video link it cannot play');
ok(mrows.some((m) => /^check: Panel m2 credits its media but cites no source/.test(m)), 'a credit without a citation is a check, not a pass');
ok(mrows.some((m) => /^check: Panel m3.* has no description for screen readers/.test(m)), 'flags pictures with no description');
ok(!mrows.some((m) => /^fix: Panel m3 has no citation/.test(m)), 'a panel citation covers a gallery');
ok(!mrows.some((m) => /Source s1 is not cited/.test(m)), 'item citations count as uses of a source');

console.log((failed ? 'FAILED ' : 'All passed: ') + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
