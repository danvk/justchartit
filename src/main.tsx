import * as React from 'react';
import * as ReactDOM from 'react-dom';

import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {Tabs, Tab} from 'material-ui/Tabs';
import { lightBaseTheme } from 'material-ui/styles';

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

// See https://github.com/callemall/material-ui/issues/2085
class TabTemplate extends React.Component<any, any> {
  render() {
    if (!this.props.selected) {
      return null;
    }

    return this.props.children;
  }
}

const STYLES = {
  root: {
    height: '100%',
  },
  container: {
    height: '100%',
    paddingTop: '8px',
  },
  tabItemContainerStyle: {
    backgroundColor: lightBaseTheme.palette.accent2Color,
  },
  tabItem: {
    color: lightBaseTheme.palette.textColor,
  }
};

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
      <div className={`layout-${layout}`}>
        <NotificationBar
          error={this.state.error}
          clearError={this.clearError} />

        <Navigation
            onRun={this.run}
            onShare={this.share}
            onSetLayout={this.setLayout}
            layout={this.state.layout} />

        <div className='table-panel'>
          <Spreadsheet
              {...this.state}
              handleAction={store.dispatch} />
        </div>

        <div className='editors-panel'>
          <Tabs
              tabItemContainerStyle={STYLES.tabItemContainerStyle}
              style={STYLES.root}
              contentContainerStyle={STYLES.container}
              tabTemplate={TabTemplate} >
            <Tab label='JS' className='tab' style={STYLES.tabItem}>
              <div style={{height: '100%'}}>
                <MonacoEditor
                  value={this.state.js}
                  language='javascript'
                  onReady={this.stashEditorReference('js')}
                  onSubmit={this.updateJS} />
              </div>
            </Tab>

            <Tab label='CSS' style={STYLES.tabItem}>
              <MonacoEditor
                value={this.state.css}
                language='css'
                onReady={this.stashEditorReference('css')}
                onSubmit={this.updateCSS} />
            </Tab>

            <Tab label='HTML' style={STYLES.tabItem}>
              <MonacoEditor
                value={this.state.html}
                language='html'
                onReady={this.stashEditorReference('html')}
                onSubmit={this.updateHTML} />
            </Tab>
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
