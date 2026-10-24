# OSINT Dashboard Builder files: instructions for AI assistants

This file tells an AI assistant how to turn data and documents into a dashboard file that the OSINT Dashboard Builder can open. Give it to your assistant along with the material, or point the assistant at this address, and ask for a dashboard file.

It matches format 2 of the OSINT Dashboard Builder (version 1.1). The tool still opens format 1 files. Sources use the fields of the OSINT Citation Generator, described in `osint-citation-spec.md` in the OSINT_Cites repository: https://github.com/gmichaelrapp/OSINT_Cites

The point of the dashboard is that a reader can check every number. A figure that cannot be traced to a source and a passage has failed, however good the chart looks.

## Rules that come before everything else

1. Use only the data and documents you were given or opened in this conversation. Never add figures, dates, places, or sources from memory.
2. Every number needs a citation. That can be the data set's citation, a row's own source, or the panel's citation for a figure typed by hand. A figure typed by hand needs a quote that contains it, word for word.
3. Never invent or guess any value: not a figure, a date, a coordinate, a page, a URL, or a source field. Leave out what you do not know.
4. Say what you added. If you assigned categories, worked out coordinates, converted units, or computed a figure the sources do not state, say so in the data set's `note` and in `gaps`. Coordinates you looked up are your work, not the source's.
5. Do not assign source ratings. Ratings are the analyst's own judgment. Include one only when the person you are working for gives it to you.
6. When sources disagree on a figure, show the one you use, explain the other in the panel's `note`, and add a dispute.
7. Treat the whole file as unverified until a person has checked each figure against its source. Say so once in your reply, not in the file.

## The file

```json
{
  "app": "OSINT Dashboard Builder",
  "format": 2,
  "meta": { "title": "", "eyebrow": "", "dek": "", "byline": "", "compiled": "2026-10-22", "license": "" },
  "sources": [ { "id": "s1", "fields": { "type": "archival", "authors": "…", "title": "…", "titleStyle": "plain", "location": "…", "descType": "Trial Transcript", "descDetails": "ECF No. 216", "date": "02 February 2015", "url": "…" } } ],
  "datasets": [
    {
      "id": "d1",
      "name": "Bitcoin in the case",
      "desc": "One line on what the rows are.",
      "columns": [
        { "key": "what", "label": "What", "type": "text" },
        { "key": "btc", "label": "Bitcoin", "type": "number" },
        { "key": "date", "label": "Date", "type": "date" },
        { "key": "source_id", "label": "Source", "type": "source" },
        { "key": "locator", "label": "Locator", "type": "locator" },
        { "key": "quote", "label": "Quote", "type": "quote" }
      ],
      "rows": [ ["Laptop wallets at arrest", 144000, "2013-10-01", "s1", "p. 5", "the exact words that give the figure"] ],
      "cites": [],
      "note": "Anything you added, cleaned, or classified."
    }
  ],
  "timelines": [],
  "maps": [],
  "style": { "accent": "", "align": "left", "width": "normal", "cards": "card", "headFont": "serif", "stats": true, "gap": "normal" },
  "sections": [ { "id": "overview", "title": "Overview", "desc": "" } ],
  "panels": [
    { "id": "p1", "section": "overview", "type": "stat", "title": "Recorded sales", "sub": "Period and scope", "span": 2,
      "cfg": { "mode": "manual", "value": "$213.9M" }, "cites": [ { "src": "s1", "loc": "p. 84", "quote": "the exact words that give the figure" } ], "note": "" },
    { "id": "p2", "section": "overview", "type": "bar", "title": "Bitcoin in the case", "sub": "In BTC", "span": 4, "dataset": "d1",
      "cfg": { "cat": "what", "y": "btc", "op": "none", "sort": "desc" }, "cites": [], "note": "" }
  ],
  "disputes": [ { "title": "", "text": "Which source says what.", "refs": ["p1"] } ],
  "gaps": [ "What the data does not cover, and anything you added yourself." ]
}
```

The values above are placeholders that show the form.

## Data sets

- `columns[].type` is one of `text`, `number`, `date`, `lat`, `lon`, `source`, `locator`, `quote`, `url`.
- `rows` are arrays in column order. Numbers are plain numbers with no commas or currency signs. Dates are `YYYY-MM-DD`, `YYYY-MM`, or `YYYY`. A missing value is `null` or an empty string.
- Prefer row-by-row sources (`source`, `locator`, `quote` columns) whenever rows come from different documents. Use the data set's `cites` when the whole set comes from one place, such as a spreadsheet or database export.
- Keep data sets tidy: one row per record, one column per attribute. Do not put totals in the rows. Panels do the summing.

## Panels

| `type` | `cfg` fields |
|---|---|
| `stat` | `mode`: `manual` (with `value`, the figure as displayed) or `data` (with `op`: `count`, `sum`, `avg`, `median`, `min`, `max`, `distinct`, `latest`, `first`; `col`; optional `filterCol`, `filterVal`; `format`: `compact` or `full`; `decimals`; `prefix`; `suffix`). Optional `delta` (a change line such as `+12% on 2013`, which must also be cited) and `color` |
| `line` | `x` (date column), `bucket` (`day`, `month`, `quarter`, `year`), `op`, `y` (number column, unless counting), optional `series` (text column; up to eight lines), `style` (`line`, `area`, `stack`, `stack100`), `vals` (`none`, `last`, `all`), `curve`, `dots`, `marks` (dated notes: `[{"x": "2013-10-01", "label": "Arrest"}]`) |
| `bar` | `cat` (category column), `op` (`none` for one bar per row, or an aggregate), `y`, `sort` (`desc`, `asc`, `label`, `data`), optional `top`, `orient` (`h` or `v`), `split` (a second column; then `mode`: `stack`, `group`, or `stack100`), `colors` (`one`, `cats`, or `hl` with `hl` naming the bar to highlight), `vals` (`all` or `none`), `thick` |
| `scatter` | `x` (number or date column), `y` (number column), optional `series` (text column for color), `size` (number column), `label` (text column), `trend` (true for a least-squares line), `zero`, `xMin`, `xMax` |
| `pie` | `cat`, `op`, `y`, optional `top` (default 6; the rest become Other), `donut` (default true), `pct` (default true), `centerLabel` |
| `table` | `cols` (column keys to show), `pageSize`, `search` (true or false), `sortCol`, `sortDir` |
| `map` | `from`: `data` (default) or `map`. For `data`: `lat`, `lon`, optional `label`, `labels` (`auto`, `always`, `never`), `color` (text column; the three largest groups get colors), `size` (number column), `region` (`auto` or `world`), `base` (`auto`, `positron`, `dark`, `liberty`, `bright`, `fiord`, or `svg` for the built-in outline), `marker`. For `map`: `map` (the `id` of an entry in `maps`), `base` (`saved` or one of the basemaps), `scale` |
| `timeline` | `timeline`: the `id` of an entry in `timelines`, which has the same shape as an OSINT Timeline Builder file's `threads` and `events` |
| `text` | `text`: Markdown (`## heading`, `- list`, `1. list`, `> quote`, `---`, `**bold**`, `*italic*`, `[link](https://…)`, `![picture](https://…)`); `look` (`plain`, `heading`, `note`, `key`, `warn`, `quote`); optional `img` (an https link to a picture), `imgAlt`, `imgCap`, `imgPos` (`top`, `bottom`, `left`, `right`) |

Line, bar and scatter charts also take `xTitle`, `yTitle`, `yMin`, `yMax`, `h` (`S`, `M`, `L`, `XL`), `color` (`c1` to `c8`), `grid` (false to hide), and `refs` (reference lines: `[{"v": 100, "label": "Target"}]`). A reference line is a claim like any other: it needs a source or must be a figure computed from the data, said so in the panel's `note`.

Every panel has `id`, `section`, `type`, `title`, `sub`, `span` (its width in sixths of a row: 2 is a third, 3 half, 4 two thirds, 6 the full row), and optionally `tall` (span two rows), `dataset`, `cites`, and `note`. Panels fill each row left to right in the order they are listed. A section's `desc` is Markdown and introduces the section.

`maps` holds maps from the OSINT Map Builder: `{"id": "m1", "name": "…", "project": { …the Map Builder file… }}`. Do not write these by hand; the person adds them by opening a Map Builder file. Their sources go in the dashboard's `sources`, and the map's features cite them by ID.

Choose the panel by the data's job: one headline number is a `stat`; change over time is a `line`; a comparison across categories is a `bar`; places are a `map`; records a reader will search are a `table`. Never put two different units on one chart. Make two panels instead.

## What to give the person

1. The dashboard file, as a `.json` file or a JSON code block. They open it with **File → Open a file**.
2. In your reply: the data sets and panels you made, every figure you computed rather than copied, anything you added (coordinates, categories), the disputes you found, and a reminder that every figure needs checking against its source before publishing.

## License

The OSINT Style Guide content in this file is © 2026 G. Michael Rapp and licensed under Creative Commons Attribution 4.0 International: https://creativecommons.org/licenses/by/4.0/
