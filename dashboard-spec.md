# OSINT Dashboard Builder files: instructions for AI assistants

This file tells an AI assistant how to turn data and documents into a dashboard file that the OSINT Dashboard Builder can open. Give it to your assistant along with the material, or point the assistant at this address, and ask for a dashboard file.

It matches format 1 of the OSINT Dashboard Builder. Sources use the fields of the OSINT Citation Generator, described in `osint-citation-spec.md` in the OSINT_Cites repository: https://github.com/gmichaelrapp/OSINT_Cites

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
  "format": 1,
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
  "sections": [ { "id": "overview", "title": "Overview", "desc": "" } ],
  "panels": [
    { "id": "p1", "section": "overview", "type": "stat", "title": "Recorded sales", "sub": "Period and scope", "width": 1,
      "cfg": { "mode": "manual", "value": "$213.9M" }, "cites": [ { "src": "s1", "loc": "p. 84", "quote": "the exact words that give the figure" } ], "note": "" },
    { "id": "p2", "section": "overview", "type": "bar", "title": "Bitcoin in the case", "sub": "In BTC", "width": 2, "dataset": "d1",
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
| `stat` | `mode`: `manual` (with `value`, the figure as displayed) or `data` (with `op`: `count`, `sum`, `avg`, `median`, `min`, `max`, `distinct`, `latest`, `first`; `col`; optional `filterCol`, `filterVal`; `format`: `compact` or `full`; `prefix`; `suffix`) |
| `line` | `x` (date column), `bucket` (`day`, `month`, `quarter`, `year`), `op`, `y` (number column, unless counting), optional `series` (text column; up to eight lines) |
| `bar` | `cat` (category column), `op` (`none` for one bar per row, or an aggregate), `y`, `sort` (`desc`, `asc`, `label`, `data`), optional `top`, `orient` (`h` or `v`) |
| `table` | `cols` (column keys to show), `pageSize`, `search` (true or false) |
| `map` | `lat`, `lon`, optional `label`, `color` (text column; the three largest groups get colors), `size` (number column), `region` (`auto` or `world`) |
| `timeline` | `timeline`: the `id` of an entry in `timelines`, which has the same shape as an OSINT Timeline Builder file's `threads` and `events` |
| `text` | `text`: paragraphs separated by a blank line; `**bold**`, `*italic*`, and `[links](https://…)` |

Every panel has `id`, `section`, `type`, `title`, `sub`, `width` (1, 2, or 3 thirds of a row), and optionally `tall` (span two rows), `dataset`, `cites`, and `note`.

Choose the panel by the data's job: one headline number is a `stat`; change over time is a `line`; a comparison across categories is a `bar`; places are a `map`; records a reader will search are a `table`. Never put two different units on one chart. Make two panels instead.

## What to give the person

1. The dashboard file, as a `.json` file or a JSON code block. They open it with **File → Open a file**.
2. In your reply: the data sets and panels you made, every figure you computed rather than copied, anything you added (coordinates, categories), the disputes you found, and a reminder that every figure needs checking against its source before publishing.

## License

The OSINT Style Guide content in this file is © 2026 G. Michael Rapp and licensed under Creative Commons Attribution 4.0 International: https://creativecommons.org/licenses/by/4.0/
