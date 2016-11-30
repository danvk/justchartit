# Just Chart It

Got some data? Just chart it!

To-do:

- Infrastructure
  - [ ] Set strictNullChecks
  - [ ] Figure out how to `import * as Dygraph from 'dygraph'`.
- Handsontable
  - [ ] Support drag & drop import of [CT]SV files
  - [ ] Remove non-en locales
- UI
  - [ ] Put in Bootstrap and add a header / menu bar
  - [ ] Add a "Run" button
  - [ ] Surface dygraphs errors/warnings in the UI
  - [ ] Add some preset styles
  - [ ] Links to examples, documentation
- Sharing
  - [ ] Post anonymous gists which are loadable with bl.ocks.org
  - [ ] Load anonymous gists
  - [ ] GitHub OAuth for non-anonymous gists.
  - [ ] Use some sort of untrusted iframe for the preview
  - [ ] Set up GitHub Pages hosting

- Completed
  - [x] Set up copy-webpack-plugin
  - [x] Update to TS 2
  - [x] Set noImplicitAny
  - [x] Bind data changes to/from store
  - [x] Add a header row with styling
  - [x] Support pasting CSV data?
  - [x] Validate numbers in body cells
  - [x] Create a preview panel
  - [x] Set up Monaco editor for HTML, CSS, JS
  - [x] Add in dygraphs typings
  - [x] Make resizing work
  - [x] Togglable panels (more space for JS / the table)
  - [x] Register justchart.it