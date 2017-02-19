/**
 * All actions which can be taken within Just Chart It.
 */

export type Edit = [number, number, string, string];  // row, col, old value, new value

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

export interface ReportError {
  type: 'report-error';
  error: Error;
}

export interface CreateShareLink {
  type: 'create-share-link';
}

export interface Run {
  type: 'run';
}

// This action gets fired once for each editor when the page loads.
// It lets the data store figure out the contents of each editor when you click "Run".
export interface StashEditorReference {
  type: 'stash-editor-reference';
  which: 'html' | 'js' | 'css';
  editor: monaco.editor.IStandaloneCodeEditor;
}

type Action = CreateShareLink |
              SetCells |
              SetCSS |
              SetHTML |
              SetJS |
              ReportError |
              Run |
              StashEditorReference ;

export default Action;
