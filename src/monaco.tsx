/// <reference path="../node_modules/monaco-editor/monaco.d.ts" />

import * as React from 'react';

import { dedent } from './utils';

declare const require: any;

interface Props {
  value: string;
  language: string;
  buttonText: string;
  onSubmit: (newValue: string) => any;
}

let hasAddedLib = false;
function maybeAddLibs() {
  if (hasAddedLib) return;

  monaco.languages.typescript.javascriptDefaults.addExtraLib(dedent`
    interface GradientStop {offset: number, color: string};
    declare let gradient_stops: {[name: string]: GradientStop[]};
    `, 'gradient.d.ts');

  monaco.languages.typescript.javascriptDefaults.addExtraLib(dedent`
    interface DrawingStyle {
      fillColor?: string;
      strokeColor?: string;
      lineWidth?: number;
      pointColor?: string;
      pointRadius?: number;
    }
    interface GeoJSONFeature {
      id: string;
      geometry: any;
      properties: any;
    }
    type GradientStyleFn = (
        feature: GeoJSONFeature,
        gradients: {[name: string]: (v: number) => string}) => DrawingStyle;
    interface StyleConfig {
      style: GradientStyleFn;
      selectedStyle?: GradientStyleFn;
    };
    declare let config: StyleConfig;
    `, 'config.d.ts');

  hasAddedLib = true;
}

export default class MonacoEditor extends React.Component<Props, {}> {
  editor: monaco.editor.IStandaloneCodeEditor;

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render(): JSX.Element {
    return (
      <div>
        <div className='monaco-editor' ref='editor'></div>
        <br/>
        <button onClick={this.handleSubmit}>{this.props.buttonText}</button>
      </div>
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
