# Changelog

Changes to the OSINT Dashboard Builder, newest first.

## 1.2 — 24 October 2026

- **Media panels.** A picture; a gallery shown as a grid, a slideshow or a sideways strip; a before-and-after slider for two pictures of one place; video from YouTube, Vimeo, the Internet Archive or a video file; a sound file; or an embedded page (Datawrapper, Flourish, Spotify, SoundCloud, Google Maps, published Google Sheets, Docs and Slides, or any https page).
- Each picture, video or recording has its own caption, credit, date, place and source. Sources are numbered in the caption and listed under the panel.
- Pictures enlarge when pressed; a gallery steps through with the arrow keys.
- Videos and embedded pages wait as a plain box until the reader presses play, so nothing loads from the other site before that. YouTube plays through its no-cookie address. Embedded pages run in a sandboxed frame.
- Key moments a reader can jump to, and a transcript or translation under the player.
- Media can be a file that sits next to the published page (`media/clip.mp4`). While editing, a copy on your computer plays in its place. The export lists the files to upload.
- **Layout:** widths in twelfths, adding a quarter and three quarters; panels one, two or three rows tall; a frame for each panel (card, shadow, flat, tinted, or none); gaps filled or the order kept; sections as tabs or one long page with links that follow along; a header picture above, beside or behind the title.
- **Check** flags media with no source, pictures with no description, video links the tool cannot play, and files that must sit next to the page.
- Dashboard file format 3: `span` is in twelfths, with `rows` and `frame` on panels, `style.flow`, `style.sections` and `meta.cover`. Files from 1.0 and 1.1 open as they are.

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
