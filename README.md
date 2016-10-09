# Just Chart It

Got some data? Just chart it!

To-do:

- Infrastructure
  ✓ Set up copy-webpack-plugin
  ✓ Update to TS 2
  ✓ Set noImplicitAny
  - Set strictNullChecks
  - Figure out how to `import * as Dygraph from 'dygraph'`.
- Handsontable
  ✓ Bind data changes to/from store
  ✓ Add a header row with styling
  - Support pasting CSV data?
  - Validate numbers in body cells
  - Support drag & drop import of [CT]SV files
- UI
  ✓ Create a preview panel
  ✓ Set up Monaco editor for HTML, CSS, JS
  ✓ Add in dygraphs typings
  - Add some preset styles
  - Togglable panels (more space for JS / the table)
  - Make resizing work
- Sharing
  - Post anonymous gists which are loadable with bl.ocks.org
  - Load anonymous gists
  - GitHub OAuth for non-anonymous gists.
  - Use some sort of untrusted iframe for the preview
