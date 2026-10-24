# OSINT Dashboard Builder

A tool for turning spreadsheet data into a sourced dashboard and publishing it as a single web page. Every figure, chart, table and map carries its citations in the form set out by the [OSINT Style Guide](https://gmichaelrapp.github.io/OSINT_Cites/), so a reader can follow any number back to the page and passage it came from.

It is one web page. There is nothing to install, no account, and no server. It is a sibling of the [OSINT Timeline Builder](https://github.com/gmichaelrapp/OSINT_Timelines): both use the same source fields and footnote formatter, and a timeline from one is a panel in the other.

## What it makes

A dashboard is a grid of panels, grouped into sections that show as tabs or as one long page. Ten kinds of panel:

| Panel | Shows | Built from |
|---|---|---|
| Figure | One number, such as a total or a count | A value you type with its citation, or a calculation on data (count, sum, average, median, smallest, largest, latest), with an optional change line (+12% on 2013) |
| Line or area chart | Change over time | A date column grouped by day, month, quarter or year, with up to eight lines, drawn as lines, shaded areas, stacked areas, or stacked to 100% |
| Bar chart | Comparisons across categories | Counts, sums or averages by category, or each row as its own bar; optionally split by a second column into stacked, side-by-side, or 100% bars |
| Scatter plot | How two numbers relate | Two number columns (or a date and a number), colored by a category, sized by a number, with an optional trend line |
| Pie or donut | Shares of a whole | Counts or sums by category, six slices or fewer by default |
| Table | Records | Any columns, with search, sorting and pages |
| Map | Locations | Latitude and longitude columns on a real, zoomable basemap, colored by a category and sized by a number; or a map made in the [OSINT Map Builder](https://github.com/gmichaelrapp/OSINT_Maps), with its symbols, arrows, areas, key and citations |
| Timeline | Dated events | A timeline file from the OSINT Timeline Builder |
| Text | Context and method | Markdown: headings, lists, quotes, bold, italics, links and pictures, in six looks: plain, section heading, note, key finding, caution, and pull quote |
| Media | Pictures, video, sound, and pages from other sites | A picture; a gallery (grid, slideshow, or sideways strip); a before-and-after slider for two pictures of one place; a video from YouTube, Vimeo, the Internet Archive or a video file; a sound file; or an embedded page (Datawrapper, Flourish, Spotify, SoundCloud, Google Maps, published Google Sheets, Docs and Slides) |

Every chart can take axis titles, a fixed axis range, value labels, reference lines (a target, an average, a threshold), its own colors (one color, a color per series, or one bar highlighted with the rest gray), and a height. Line charts can also carry dated notes, such as "Arrest" marked on the time axis.

Under every panel:

- **Sources** lists the footnotes behind it: the panel's own, its data set's, and each row's source where the data cites row by row.
- **Show the numbers** opens the values behind a chart as a table. **CSV** downloads them.
- **Disputed** appears when a figure is in a dispute. Disputes and gaps sit at the foot of the page.

### Media

Every picture, video and recording carries its own caption, credit, date, place and source, so a reader can see where it came from and when. Its source appears in the caption as **Source 1**, **Source 2** and so on, numbered in the panel's **Sources** list. Pictures enlarge when pressed, and a gallery's pictures can be stepped through with the arrow keys.

- **Pictures** can be kept inside the dashboard (they are shrunk to 1600 pixels wide), linked from the web, or named as a file that sits next to the published page, such as `media/strike.jpg`.
- **Before and after** puts one picture over the other with a slider between them, labeled with their dates. Both pictures need the same view at the same size.
- **Video** takes a YouTube, Vimeo or Internet Archive link, or an `.mp4` or `.webm` file. Players from other sites wait as a plain box until a reader presses play, so nothing loads from YouTube or Vimeo before that; YouTube plays through its no-cookie address. **Key moments** list times a reader can jump to (`0:42 Impact on the loading yard`), and a **transcript or translation** opens under the player.
- **Sound** takes an `.mp3`, `.m4a`, `.ogg` or `.wav` file, with an optional cover picture, key moments and transcript.
- **Embedded pages** wait for a press too, unless set to load as the page opens. Share links from YouTube, Vimeo, Spotify, SoundCloud, Flourish and Datawrapper are turned into their embed addresses.

Video and sound are never stored inside the dashboard; they would make it too big to open. Link to them, or put the files next to the page. While editing, **Preview a file…** plays a copy from your computer so you can set it up before uploading it.

### Layout

- **Width:** a sixth, a quarter, a third, half, two thirds, three quarters, five sixths or the full row. Four figures across is a row of quarters.
- **Height:** one, two or three rows, so smaller panels stack beside a tall one.
- **Frame:** each panel can follow the page's style or have its own: a card with a border, a card with a shadow, flat, tinted with the accent color, or no frame at all (good for a picture that should sit on the page).
- **Gaps in a row:** let smaller panels move up to fill them, or keep the panels in exactly the order given.
- **Sections:** as tabs, one at a time, or as one long page with a link to each section that marks the one being read. A long page reads like an article and prints whole.
- **Header picture:** above the title, beside it, or behind it and darkened, with a caption and credit.

Charts have hover readouts and a legend wherever there is more than one series. The series colors are a palette tested for color-blind separation in both light and dark themes. The layout works on a phone.

The Silk Road example in `examples/silk-road-dashboard.json` shows most of it. It has stat tiles from trial testimony, a map of the places in the case, a sentences table, the bitcoin amounts named in the record, and 475 docket entries charted by quarter and kind, with the arrest and the trial marked.

## Using it

Open `index.html` in any current browser, or use the hosted copy linked in this repository's About box. It opens on the sample dashboard.

1. **Data.** Add data four ways:
   - **CSV file…** Any CSV from Excel or Google Sheets works, and tab- and semicolon-separated files do too.
   - **Paste a table.** Copy cells straight from a spreadsheet, header row included, and paste.
   - **From a link.** The address of a CSV file, such as a Google Sheet published as CSV. It is read once; the dashboard keeps a copy.
   - **Type it in.** Name the columns, then fill in the rows.

   Column types are guessed: text, number, date, latitude, longitude, source, locator, quote, or URL. Check them and change any that are wrong. Every data set has a row editor: change a cell, add or delete rows, paste more rows, and add, move, rename or delete columns.
2. **Cite the data.** Give the whole data set a citation. Or, better, add a `source_id` column (with `locator` and `quote` if you have them) so each row cites its own source. The IDs match the sources under **Sources**.
3. **Panels → Add panel.** Pick the data and the columns, then the look. The preview updates as you go.
4. **Layout.** The dashboard as it will look, section by section. Drag a panel by its handle to move it, or drop it on a section tab to move it there. Drag its right edge, or use − and +, to change its width, from a sixth to the full row. The row button makes it one, two or three rows tall, so smaller panels sit beside it.
5. **Sections, Disputes & gaps, Page & style.** Split a big project into sections, each with an introduction in Markdown; record where sources disagree; set the title, summary, byline and header picture; and choose the accent color, title font, header alignment, page width, panel style, spacing, whether sections show as tabs or one long page, and whether panels fill gaps.
6. **Check.** Lists everything to fix across the dashboard, including data with no citation, a panel missing a column, a typed figure with no citation, media with no source, a picture with no description for screen readers, a video link the tool cannot play, files that must sit next to the page, a dispute pointing nowhere, and every check the Citation Generator would raise on a source.

### Columns it recognizes by name

| Header | Read as |
|---|---|
| `lat`, `latitude` | latitude |
| `lon`, `lng`, `long`, `longitude` | longitude |
| `source_id`, `source` | the ID of a source in the source list |
| `locator`, `page`, `pinpoint` | page, section, or timestamp in that source |
| `quote`, `excerpt` | the passage the row rests on |
| `url`, `link` | a link |

Numbers can carry commas, currency signs and percent signs. Dates can be in almost any form; slashes are read as month/day/year.

### Ratings

A rating is a letter and a number, such as `B2`. The letter (A to F) rates the reliability of the source and the number (1 to 6) rates the credibility of the information. The pair falls in a zone: green, yellow, orange, red or gray. Ratings are optional and are always the analyst's own judgment.

## Files

**File → Save dashboard** writes a `.json` file holding everything: data, panels, sources and timelines. **File → Open a file** reads:

| File | What happens |
|---|---|
| A dashboard (`.json`) saved from this tool | It replaces the open dashboard, after you confirm |
| Data (`.csv`, `.tsv`) | It is added as a new data set |
| A timeline (`.json`) saved from the OSINT Timeline Builder | It is added with its sources as a new timeline panel |
| A map (`.json`) saved from the OSINT Map Builder | It is added with its sources as a new map panel. Its key is drawn under it, and its citations are listed under the panel, numbered as on the map. To update it, use **Data → the map → Replace from a newer file** |
| A source list (`.json`) saved from the OSINT Citation Generator | Its sources are added to the source list |

You can also drag a file onto the page.

**Exports:**

| Export | What you get |
|---|---|
| Publishable page (`index.html`) | One file holding the dashboard, view only, with a **Get the data** button |
| Source list (`.json`) | Opens in the OSINT Citation Generator with every field intact |
| Footnotes (`.md`) | Every source as a full footnote, numbered |

## How big can it get?

All data lives in the page, so the limit is what a browser handles comfortably. Tens of thousands of rows are fine. Past about 10 MB of data the page grows slow to load. At that point, summarize before importing: monthly counts rather than every record. The **Page** tab shows the current size.

Dashboards here are snapshots. To update one, replace a data set's rows with a fresh CSV (**Data → Replace rows from a CSV**) and export again. Live feeds that update themselves need a server, which this tool deliberately does not use.

## Publishing on GitHub Pages

1. Make a new public repository.
2. Upload the exported `index.html`.
3. In **Settings → Pages**, deploy from the `main` branch, `/ (root)`.

The page will be at `https://<your-username>.github.io/<repository>/`. Add `#<panel-id>` to the address to link to a single panel.

If the dashboard names files to sit next to it (`media/clip.mp4`, say), the export lists them. Upload them to the repository with those names, folders included. GitHub takes files up to 100 MB, but a page loads faster with video under about 25 MB; for longer video, a YouTube, Vimeo or Internet Archive link is easier on readers.

YouTube plays its videos only on pages served from a web address. Opened straight from a file on your computer, a YouTube player may refuse; on GitHub Pages it plays.

## Using it with an AI assistant

`dashboard-spec.md` tells an AI assistant how to write a dashboard file this tool can open. It covers the data sets with row-by-row sources, panels and sections, and the rules against inventing figures. Give the assistant that file and your data or documents, then open the result here and check it before you publish.

## Your data

The page runs entirely in your browser and sends nothing anywhere. Your dashboard is kept in the browser's local storage on your device.

A dashboard with no maps, or whose maps use the **Plain outline** basemap, loads nothing from other sites: the outlines are built into the page. A map on a real basemap loads the MapLibre map library (and, for military symbols, milsymbol) from jsDelivr, with integrity checks so a changed copy is refused, and its map tiles from OpenFreeMap. If those cannot be reached, a data map falls back to the built-in outline. Save it to a file to move it or keep it safe. A very large dashboard may not fit in local storage; the page tells you when that happens.

Media loads from wherever it lives. A picture linked from the web loads from that site as the page opens. Videos from YouTube, Vimeo and the Internet Archive, and embedded pages, load nothing until the reader presses play (unless an embed is set to load as the page opens). Embedded pages run in a sandboxed frame.

**File → Open the Silk Road example** reads `examples/silk-road-dashboard.json` from the same site, and **Data → From a link** reads the address you give it.

## Tests

`node Tests/run.js` checks number and date reading, CSV typing, aggregation (including split bars and scatter plots), row and column editing, reading files from earlier versions (widths, heights and frames), reading video, sound and embed links, media addresses and times, footnotes, the checks (including maps from the Map Builder and media), and the example. It needs Node 18 or later and nothing else, and it runs on GitHub on every push.

## Credits and license

- The citation formatter, the source types and the description library are taken from the [OSINT Citation Generator](https://github.com/gmichaelrapp/OSINT_Cites) v3.2.1.
- Map outlines: [Natural Earth](https://www.naturalearthdata.com/) 1:110m (public domain), via world-atlas 2.0.2.
- The map engine (basemaps, symbols, labels, arrows) is shared with the [OSINT Map Builder](https://github.com/gmichaelrapp/OSINT_Maps). Maps are drawn with [MapLibre GL JS](https://maplibre.org/) 5.24.0 (BSD-3-Clause) and military symbols with [milsymbol](https://github.com/spatialillusions/milsymbol) 3.0.4 (MIT), both loaded only when needed. Military symbol names: mil-std-2525 by Måns Beckman (MIT). Basemaps: [OpenFreeMap](https://openfreemap.org/), © OpenMapTiles, data © OpenStreetMap contributors.
- Code: MIT License (`LICENSE-MIT`)
- OSINT Style Guide content: the citation rules, description library, and qualifier and access lists, under Creative Commons Attribution 4.0 International (`LICENSE-CC-BY-4.0`)

© 2026 G. Michael Rapp.
