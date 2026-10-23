# OSINT Dashboard Builder

A tool for turning spreadsheet data into a sourced dashboard and publishing it as a single web page. Every figure, chart, table and map carries its citations in the form set out by the [OSINT Style Guide](https://gmichaelrapp.github.io/OSINT_Cites/), so a reader can follow any number back to the page and passage it came from.

It is one web page. There is nothing to install, no account, and no server. It is a sibling of the [OSINT Timeline Builder](https://github.com/gmichaelrapp/OSINT_Timelines): both use the same source fields and footnote formatter, and a timeline from one is a panel in the other.

## What it makes

A dashboard is a grid of panels, grouped into sections that show as tabs. Seven kinds of panel:

| Panel | Shows | Built from |
|---|---|---|
| Figure | One number, such as a total or a count | A value you type with its citation, or a calculation on data (count, sum, average, median, smallest, largest, latest) |
| Line chart | Change over time | A date column grouped by day, month, quarter or year, with up to eight lines |
| Bar chart | Comparisons across categories | Counts, sums or averages by category, or each row as its own bar |
| Table | Records | Any columns, with search, sorting and pages |
| Map | Locations | Latitude and longitude columns, colored by a category and sized by a number |
| Timeline | Dated events | A timeline file from the OSINT Timeline Builder |
| Text | Context and method | Paragraphs with bold, italics and links |

Under every panel:

- **Sources** lists the footnotes behind it: the panel's own, its data set's, and each row's source where the data cites row by row.
- **Show the numbers** opens the values behind a chart as a table. **CSV** downloads them.
- **Disputed** appears when a figure is in a dispute. Disputes and gaps sit at the foot of the page.

Charts have hover readouts and a legend wherever there is more than one series. The series colors are a palette tested for color-blind separation in both light and dark themes. The layout works on a phone.

The Silk Road example in `examples/silk-road-dashboard.json` shows all of it. It has stat tiles from trial testimony, a map, a sentences table, the bitcoin amounts named in the record, and 475 docket entries charted by quarter and kind.

## Using it

Open `index.html` in any current browser, or use the hosted copy linked in this repository's About box. It opens on the sample dashboard.

1. **Data → Add data from a CSV.** Any CSV from Excel or Google Sheets works, and tab- and semicolon-separated files do too. Column types are guessed: text, number, date, latitude, longitude, source, locator, quote, or URL. Check them and change any that are wrong.
2. **Cite the data.** Give the whole data set a citation. Or, better, add a `source_id` column (with `locator` and `quote` if you have them) so each row cites its own source. The IDs match the sources under **Sources**.
3. **Panels → Add panel.** Pick the data and the columns. The preview updates as you go. A panel can take a third, two thirds or the full width of the row. **Tall** lets it span two rows, so smaller panels sit beside it.
4. **Sections, Disputes & gaps, Page.** Split a big project into tabs, record where sources disagree, and set the title, summary and byline.
5. **Check.** Lists everything to fix across the dashboard, including data with no citation, a panel missing a column, a typed figure with no citation, a dispute pointing nowhere, and every check the Citation Generator would raise on a source.

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

## Using it with an AI assistant

`dashboard-spec.md` tells an AI assistant how to write a dashboard file this tool can open. It covers the data sets with row-by-row sources, panels and sections, and the rules against inventing figures. Give the assistant that file and your data or documents, then open the result here and check it before you publish.

## Your data

The page runs entirely in your browser. It sends nothing anywhere and loads nothing from other sites. The map outlines are built into the page. Your dashboard is kept in the browser's local storage on your device. Save it to a file to move it or keep it safe. A very large dashboard may not fit in local storage; the page tells you when that happens.

The one request the page makes is **File → Open the Silk Road example**, which reads `examples/silk-road-dashboard.json` from the same site.

## Tests

`node Tests/run.js` checks number and date reading, CSV typing, aggregation, footnotes, the checks, and the example. It needs Node 18 or later and nothing else, and it runs on GitHub on every push.

## Credits and license

- The citation formatter, the source types and the description library are taken from the [OSINT Citation Generator](https://github.com/gmichaelrapp/OSINT_Cites) v3.2.1.
- Map outlines: [Natural Earth](https://www.naturalearthdata.com/) 1:110m (public domain), via world-atlas 2.0.2.
- Code: MIT License (`LICENSE-MIT`)
- OSINT Style Guide content: the citation rules, description library, and qualifier and access lists, under Creative Commons Attribution 4.0 International (`LICENSE-CC-BY-4.0`)

© 2026 G. Michael Rapp.
