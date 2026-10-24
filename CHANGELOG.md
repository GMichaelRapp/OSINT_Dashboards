# Changelog

Changes to the OSINT Dashboard Builder, newest first.

## 1.1 — 23 October 2026

- **Real maps.** Data maps draw on a zoomable basemap (light, dark, streets, bright or dark blue; or the built-in outline), with labels kept clear of each other and a box of details and sources when a point is clicked. Maps made in the OSINT Map Builder open as panels with their symbols, arrows, areas, key and numbered citations.
- **New charts:** scatter plots (with size, color and a trend line) and pie or donut charts. Bars can be split by a second column into stacked, side-by-side or 100% bars. Line charts can be drawn as shaded, stacked, or 100% areas, with smooth curves and dots.
- **Chart options:** axis titles and ranges, value labels, reference lines, dated notes on the time axis, colors (one color, a color per series, or one bar highlighted), bar thickness, height, decimals.
- **Text:** Markdown headings, lists, quotes and rules; pictures, uploaded or linked, with captions; six looks (plain, section heading, note, key finding, caution, pull quote). Section introductions and the summary take Markdown too.
- **Layout tab:** drag panels into place and across sections, resize them by their edge, in sixths of the row.
- **Page & style:** accent color, title font, header alignment, page width, panel style, spacing, and whether to show the counts under the title.
- **Data:** paste a table, load a CSV from a link, or type one in; edit rows and columns in place.
- Figures can carry a change line and their own color.
- Dashboard file format 2. Files from 1.0 open as they are.

## 1.0 — 22 October 2026

First release.

- **Panels:** figure, line chart, bar chart, table, map, timeline, and text, laid out in a three-column grid with sections as tabs.
- **Data:** read from CSV, tab- or semicolon-separated files, with column types guessed and editable. Citations work for a whole data set or row by row through `source_id`, `locator`, and `quote` columns.
- **Under every panel:** sources as OSINT Style Guide footnotes, a table of the plotted numbers, and a CSV download.
- **Disputes and gaps,** linked to panels.
- **Check tab:** lists everything to fix across the dashboard.
- **Opens:** dashboard files, CSV data, OSINT Timeline Builder timelines, and OSINT Citation Generator source lists.
- **Exports:** a publishable single-file page, a Citation Generator source list, and Markdown footnotes.
- **Built in:** map outlines from Natural Earth 1:110m, so the page makes no outside requests.
- Dashboard file format 1.
- `dashboard-spec.md`: instructions for AI assistants that write dashboard files.
- Example: *Silk Road, by the Numbers*, built from the *United States v. Ulbricht* record.
