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
  constructor(props: {}) {
    super(props);
    this.state = store.getState();
    this.clearError = this.clearError.bind(this);
    this.updateHTML = this.updateHTML.bind(this);
    this.updateCSS = this.updateCSS.bind(this);
    this.changeTab = this.changeTab.bind(this);
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
        <div className='table-panel'>
          <Spreadsheet
              {...this.state}
              handleAction={store.dispatch} />
        </div>
        <div className='editors'>
          <TabChooser
            tabs={TABS}
            selectedTab={this.state.selectedTab}
            onChange={this.changeTab} />
          <div className='editor'>
            <div className='panel html-panel' style={visStyle(this.state.selectedTab === 'HTML')}>
              <MonacoEditor
                value={this.state.html}
                language='html'
                onSubmit={this.updateHTML} />
            </div>
            <div className='panel css-panel' style={visStyle(this.state.selectedTab === 'CSS')}>
              <MonacoEditor
                value={this.state.css}
                language='css'
                onSubmit={this.updateCSS} />
            </div>
            <div className='panel js-panel' style={visStyle(this.state.selectedTab === 'JS')}>
              <MonacoEditor
                value={this.state.js}
                language='javascript'
                onSubmit={this.updateJS} />
            </div>
          </div>
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

  changeTab(selectedTab: string) {
    store.dispatch({
      type: 'change-tab',
      tab: selectedTab,
    });
  }
}

ReactDOM.render(<Root />, rootEl);
