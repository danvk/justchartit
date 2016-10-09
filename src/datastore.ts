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
  selectedTab: string;
  error: string;
  shareLink: string;
}

function createStore() {
  let js = defaults.JS;
  let css = defaults.CSS;
  let html = defaults.HTML;
  let data = defaults.data;
  let selectedTab = 'JS';

  let error: string = null;
  let shareLink: string = null;

  function handleAction(action: Action) {
    switch (action.type) {
      case 'set-cells':
        setCells(action as actions.SetCells);
        break;

      case 'set-js':
        setJS(action as actions.SetJS);
        break;

      case 'set-css':
        setCSS(action as actions.SetCSS);
        break;

      case 'set-html':
        setHTML(action as actions.SetHTML);
        break;

      case 'change-tab':
        selectedTab = (action as actions.ChangeTab).tab;
        stateChanged();
        break;

      case 'report-error':
        reportError(action as actions.ReportError);
        break;

      case 'create-share-link':
        createShareLink();
        break;
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
      selectedTab,
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
