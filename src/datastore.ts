import * as _ from 'underscore';

import Action, * as actions from './action';

import * as defaults from './defaults';
import * as utils from './utils';

/** This is the state exported by this store via store.getState(). */
export interface State {
  js: string;
  css: string;
  html: string;
  data: string[][];
  error: string;
  shareLink: string;
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

  function handleAction(action: Action) {
    switch (action.type) {
      case 'set-cells':         setCells(action); break;
      case 'set-js':            setJS(action); break;
      case 'set-css':           setCSS(action); break;
      case 'set-html':          setHTML(action); break;
      case 'report-error':      reportError(action); break;
      case 'create-share-link': createShareLink(); break;
      case 'run':               run(); break;
      case 'stash-editor-reference':
          editors[action.which] = action.editor;
    }
  }

  function setCells(action: actions.SetCells) {
    for (const [row, col, , newValue] of action.edits) {
      data[row][col] = newValue;
    }
    updateChart();
    stateChanged();
  }

  function setCSS(action: actions.SetCSS) {
    css = action.css;
    updateChart();
    stateChanged();
  }

  function setJS(action: actions.SetJS) {
    js = action.js;
    updateChart();
    stateChanged();
  }

  function setHTML(action: actions.SetHTML) {
    html = action.html;
    updateChart();
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
    updateChart();
    stateChanged();
  }

  function createShareLink() {
  }

  function updateChart() {
  }

  function initialize() {
  }

  const subscribers = [] as (() => any)[];
  function stateChanged() {
    subscribers.forEach(fn => fn());
  }

  function getState(): State {
    return {
      html,
      css,
      js,
      data,
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
