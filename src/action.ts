/**
 * All actions which can be taken within Just Chart It.
 */

type Edit = [number, number, string, string];  // row, col, old value, new value

export interface SetCells {
  type: 'set-cells',
  source: string;  // e.g. autofill, paste, edit, ...
  edits: Edit[];
}

export interface SetJS {
  type: 'set-js';
  js: string;
}

export interface SetCSS {
  type: 'set-css';
  css: string;
}

export interface SetHTML {
  type: 'set-html';
  html: string;
}

export interface ChangeTab {
  type: 'change-tab';
  tab: string;
}

export interface ReportError {
  type: 'report-error';
  error: Error;
}

export interface CreateShareLink {
  type: 'create-share-link';
}

type Action = SetCells |
              SetJS |
              SetCSS |
              SetHTML |
              ChangeTab |
              ReportError |
              CreateShareLink;

export default Action;
