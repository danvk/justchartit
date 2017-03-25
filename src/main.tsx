import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import * as actions from './action';
import createStore, {AppState} from './datastore';
import MonacoEditor from './monaco';
import NotificationBar from './notification-bar';
import Preview from './preview';
import Spreadsheet from './spreadsheet';
import Navigation from './navigation';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
import * as injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const rootEl = document.getElementById('root');
const store = createStore();

const TABS = [
  'HTML',
  'CSS',
  'JS',
];

class Root extends React.Component<{}, AppState> {
  stashEditorReference: (type: 'html' | 'js' | 'css') =>
      (editor: monaco.editor.IStandaloneCodeEditor) => any;

  constructor(props: {}) {
    super(props);
    this.state = store.getState();
    this.clearError = this.clearError.bind(this);
    this.updateHTML = this.updateHTML.bind(this);
    this.updateCSS = this.updateCSS.bind(this);
    this.setLayout = this.setLayout.bind(this);
    this.run = this.run.bind(this);
    this.share = this.share.bind(this);
    this.stashEditorReference = which => editor => store.dispatch({
      type: 'stash-editor-reference',
      which,
      editor,
    })
  }

  render(): JSX.Element {
    const { layout } = this.state;
    return (
      <div>
        <NotificationBar
          error={this.state.error}
          clearError={this.clearError} />

        <Navigation
            onRun={this.run}
            onShare={this.share}
            onSetLayout={this.setLayout}
            layout={this.state.layout} />

        <div className={layout === 'default' ? 'table-panel' : 'editors'}>
          <Spreadsheet
              {...this.state}
              handleAction={store.dispatch} />
        </div>
        <div className={layout === 'default' ? 'editors' : 'table-layout'}>
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

  setLayout(layout: actions.Layout) {
    store.dispatch({
      type: 'set-layout',
      layout,
    });
  }

  run() {
    store.dispatch({ type: 'run' });
  }

  share() {
    store.dispatch({ type: 'create-share-link' });
  }
}

const App = () => (
  <MuiThemeProvider>
    <Root />
  </MuiThemeProvider>
);

ReactDOM.render(<App />, rootEl);
