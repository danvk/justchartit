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

- [ ] Loading with a gist doesn't auto-run it.
- [ ] GitHub OAuth for non-anonymous gists.
      State dump:
      GitHub OAuth requires a server to POST back your temporary code in exchange for a token. This server has your client secret.
      I've used GateKeeper to deploy a simple exchange server here:
      https://justchartit.herokuapp.com/
      This is the same approach that geojson.io uses.
      Unfortunately, I can only use one redirect url for any client_id:
      http://stackoverflow.com/questions/35942009/github-oauth-multiple-authorization-callback-url
      This will make it annoying to simulate OAuth for development.
      Once JCI is launched, I may want to use a different workflow for OAuth.
      Alternatively I could run GateKeeper locally.
- [ ] Use a popover for layout
- [ ] Surface dygraphs errors/warnings in the UI
- [ ] Support drag & drop import of [CT]SV files
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

Bugs:
- [ ] Switching to "Data primary" layout shows a clipped spreadsheet

- [x] Use some sort of untrusted iframe for the preview
- [x] Add a way to add rows & columns to the table (context menu)