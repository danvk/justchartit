import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import createStore, {State} from './datastore';
import MonacoEditor from './monaco';
import NotificationBar from './notification-bar';
import Preview from './preview';
import Spreadsheet from './spreadsheet';

const rootEl = document.getElementById('root');
const store = createStore();

const TABS = [
  'HTML',
  'CSS',
  'JS',
];

class Root extends React.Component<{}, State> {
  stashEditorReference: (type: 'html' | 'js' | 'css') =>
      (editor: monaco.editor.IStandaloneCodeEditor) => any;

  constructor(props: {}) {
    super(props);
    this.state = store.getState();
    this.clearError = this.clearError.bind(this);
    this.updateHTML = this.updateHTML.bind(this);
    this.updateCSS = this.updateCSS.bind(this);
    this.run = this.run.bind(this);
    this.stashEditorReference = which => editor => store.dispatch({
      type: 'stash-editor-reference',
      which,
      editor,
    })
  }

  render(): JSX.Element {
    const handleAction = store.dispatch.bind(store);

    const shareLink = () => {
      store.dispatch({ type: 'create-share-link' });
    };

    const visStyle = (visible: boolean) => ({
      display: visible ? '' : 'none',
    });

    return (
      <div>
        <NotificationBar
          error={this.state.error}
          clearError={this.clearError} />
        <div className='header'>
          <button onClick={this.run}>Run</button>
        </div>
        <div className='table-panel'>
          <Spreadsheet
              {...this.state}
              handleAction={store.dispatch} />
        </div>
        <div className='editors'>
          <Tabs>
            <TabList>
              <Tab>JS</Tab>
              <Tab>HTML</Tab>
              <Tab>CSS</Tab>
            </TabList>

            <TabPanel>
              <MonacoEditor
                value={this.state.js}
                language='javascript'
                onReady={this.stashEditorReference('js')}
                onSubmit={this.updateJS} />
            </TabPanel>

            <TabPanel>
              <MonacoEditor
                value={this.state.html}
                language='html'
                onReady={this.stashEditorReference('html')}
                onSubmit={this.updateHTML} />
            </TabPanel>

            <TabPanel>
              <MonacoEditor
                value={this.state.css}
                language='css'
                onReady={this.stashEditorReference('css')}
                onSubmit={this.updateCSS} />
            </TabPanel>
          </Tabs>
        </div>
        <div className='output-panel'>
          <h3>Output</h3>
          <Preview {...this.state} />
        </div>
      </div>
    );
  }

  componentDidMount() {
    store.subscribe(() => {
      this.setState(store.getState());
    });
  }

  clearError() {
    store.dispatch({
      type: 'report-error',
      error: null,
    });
  }

  updateHTML(html: string) {
    store.dispatch({
      type: 'set-html',
      html,
    });
  }

  updateCSS(css: string) {
    store.dispatch({
      type: 'set-css',
      css,
    });
  }

  updateJS(js: string) {
    store.dispatch({
      type: 'set-js',
      js,
    });
  }

  run() {
    store.dispatch({ type: 'run' });
  }
}

ReactDOM.render(<Root />, rootEl);
