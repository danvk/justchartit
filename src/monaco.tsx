/// <reference path="../node_modules/monaco-editor/monaco.d.ts" />

import * as React from 'react';

import { dedent } from './utils';

declare const require: any;

interface Props {
  value: string;
  language: string;
  onSubmit: (newValue: string) => any;
}

let hasAddedLib = false;
function maybeAddLibs() {
  if (hasAddedLib) return;

  fetch('dygraphs/dygraphs.d.ts')
  .then(response => response.text())
  .then(text => {
    if (!hasAddedLib) {
      const addExtraLib = (text: string, filename?: string) =>
          monaco.languages.typescript.javascriptDefaults.addExtraLib(text, filename);
      addExtraLib('declare let data: string;', 'data.d.ts');
      addExtraLib(`declare namespace google {
        namespace visualization {
          type DataTable = any;
        }
      }`, 'google.visualization.d.ts');
      addExtraLib(text, 'dygraphs.d.ts');
      hasAddedLib = true;
    }
  }).catch(e => {
    console.error(e);
  });
}

export default class MonacoEditor extends React.Component<Props, {}> {
  editor: monaco.editor.IStandaloneCodeEditor;

  constructor(props: Props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render(): JSX.Element {
    return (
      <div className='monaco-editor' ref='editor'></div>
    );
  }

  componentDidMount() {
    // Monaco requires the AMD module loader to be present on the page. It is not yet
    // compatible with ES6 imports. Once that happens, we can get rid of this.
    // See https://github.com/Microsoft/monaco-editor/issues/18
    (window['require'])(['vs/editor/editor.main'], () => {
      maybeAddLibs();

      this.editor = monaco.editor.create(this.refs['editor'] as HTMLDivElement, {
        value: this.props.value || '',
        language: this.props.language,
        lineNumbers: 'on',
      });

      this.editor.onKeyDown(event => {
        if (event.keyCode === 3 && (event.metaKey || event.ctrlKey)) {
          this.handleSubmit();
        }
      });
    });
  }

  handleSubmit() {
    this.props.onSubmit(this.editor.getValue());
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.value !== this.props.value && this.editor) {
      this.editor.setValue(this.props.value);
    }

    if (prevProps.language !== this.props.language) {
      throw new Error('<MonacoEditor> language cannot be changed.');
    }
  }
}
