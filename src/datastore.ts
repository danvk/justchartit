import * as _ from 'underscore';

import Action, * as actions from './action';

import * as defaults from './defaults';
import * as gist from './gist';
import * as utils from './utils';

/** This is the state exported by this store via store.getState(). */
export interface AppState {
  js: string;
  css: string;
  html: string;
  data: string[][];
  error: string;
  shareLink: string;
  layout: actions.Layout;
}

function createStore() {
  let js = defaults.JS;
  let css = defaults.CSS;
  let html = defaults.HTML;
  let data = defaults.data;
  let editors = {
    html: null as monaco.editor.IStandaloneCodeEditor,
    js: null as monaco.editor.IStandaloneCodeEditor,
    css: null as monaco.editor.IStandaloneCodeEditor,
  };

  let error: string = null;
  let shareLink: string = null;
  let layout: actions.Layout = 'default';

  function handleAction(action: Action) {
    switch (action.type) {
      case 'set-cells':         setCells(action); break;
      case 'set-js':            setJS(action); break;
      case 'set-css':           setCSS(action); break;
      case 'set-html':          setHTML(action); break;
      case 'report-error':      reportError(action); break;
      case 'create-share-link': createShareLink(); break;
      case 'set-layout':        layout = action.layout; stateChanged(); break;
      case 'run':               run(); break;
      case 'stash-editor-reference':
          editors[action.which] = action.editor;
    }
  }

  function setCells(action: actions.SetCells) {
    for (const [row, col, , newValue] of action.edits) {
      data[row][col] = newValue;
    }
    stateChanged();
  }

  function setCSS(action: actions.SetCSS) {
    css = action.css;
    stateChanged();
  }

  function setJS(action: actions.SetJS) {
    js = action.js;
    stateChanged();
  }

  function setHTML(action: actions.SetHTML) {
    html = action.html;
    stateChanged();
  }

  function reportError(action: actions.ReportError) {
    if (action.error) {
      error = action.error.toString();
    } else {
      error = null;
    }
    stateChanged();
  }

  function run() {
    // Only editors which have been initialized can have unsaved changes.
    if (editors.html) html = editors.html.getValue();
    if (editors.js) js = editors.js.getValue();
    if (editors.css) css = editors.css.getValue();
    stateChanged();
  }

  function createShareLink() {
    gist.postGist({ html, js, css, data }).then(gistData => {
      shareLink = `https://bl.ocks.org/${gistData.id}`;
      window.location.hash = gistData.id;
      stateChanged();
    }).catch(e => {
      console.error(e);
      error = `Unable to save gist`;
      stateChanged();
    });
  }

  function initialize() {
    const hash = window.location.hash;
    if (!hash) return;

    const gistId = hash.slice(1);  // remove the '#'.
    gist.getGist(gistId)
      .then(loadFromGistObject)
      .catch(e => {
        console.error(e);
        error = `Unable to load gist ${gistId}`;
        stateChanged();
      })
  }

  function loadFromGistObject(gistData: gist.Gist) {
    error = gist.validateGist(gistData);
    if (error) {
      stateChanged();
      return;
    }

    const parsed = gist.parseGist(gistData);
    html = parsed.html;
    css = parsed.css;
    js = parsed.js;
    data = parsed.data;

    stateChanged();
  }

  const subscribers = [] as (() => any)[];
  function stateChanged() {
    subscribers.forEach(fn => fn());
  }

  function getState(): AppState {
    return {
      html,
      css,
      js,
      data,
      layout,
      error,
      shareLink,
    };
  }

  initialize();

  return {
    getState,
    dispatch(action: Action) {
      handleAction(action);
    },
    subscribe(callback: () => any) {
      subscribers.push(callback);
    },
  };
}

export default createStore;
