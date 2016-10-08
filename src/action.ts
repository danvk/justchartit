/**
 * All actions which can be taken within Just Chart It.
 */

export interface SetData {
  type: 'set-data';
  data: string[][];
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

export interface ReportError {
  type: 'report-error';
  error: Error;
}

export interface CreateShareLink {
  type: 'create-share-link';
}

type Action = SetData |
              SetJS |
              SetCSS |
              SetHTML |
              ReportError |
              CreateShareLink;

export default Action;
