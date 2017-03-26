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

- [ ] Use some sort of untrusted iframe for the preview
- [ ] GitHub OAuth for non-anonymous gists.
- [ ] Use a popover for layout
- [ ] Surface dygraphs errors/warnings in the UI
- [ ] Support drag & drop import of [CT]SV files
- [ ] Add a way to add rows & columns to the table
- [ ] Remove non-en locales
- [ ] Add some preset styles
- [ ] Make Cmd-S save/share
- [ ] Save layout to a cookie
- [ ] Give charts/gists titles
- [ ] Pick a non-default theme color
- [ ] Make the panels resizable
- [ ] Set strictNullChecks
- [ ] Set up GitHub Pages hosting
- [ ] tslint
