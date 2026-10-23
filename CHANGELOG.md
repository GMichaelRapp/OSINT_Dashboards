# Changelog

Changes to the OSINT Dashboard Builder, newest first.

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
