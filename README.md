# Just Chart It

Got some data? Just chart it!

## Quickstart

    npm install -g yarn
    yarn
    yarn develop

## Deployment

    rm -rf ../danvk.github.io/justchartit
    webpack
    cp -r static ../danvk.github.io/justchartit
    cd ../danvk.github.io
    git commit -a -m 'Update JustChartIt'
    git push

## To-do

- Infrastructure
  - [ ] Set strictNullChecks
  - [ ] Set up GitHub Pages hosting
  - [ ] tslint
- Handsontable
  - [ ] Support drag & drop import of [CT]SV files
  - [ ] Remove non-en locales
  - [ ] Add a way to add rows & columns to the table
- UI
  - [ ] Surface dygraphs errors/warnings in the UI
  - [ ] Add some preset styles
  - [ ] Make Cmd-S save/share
  - [ ] Use a popover for layout
  - [ ] Save layout to a cookie
  - [ ] Give charts/gists titles
  - [ ] Pick a non-default theme color
  - [ ] Make the panels resizable
- Sharing
  - [ ] GitHub OAuth for non-anonymous gists.
  - [ ] Use some sort of untrusted iframe for the preview
