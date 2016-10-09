import * as React from 'react';
import * as ReactDOM from 'react-dom';

import createStore, {State} from './datastore';
import MonacoEditor from './monaco';
import NotificationBar from './notification-bar';
import Preview from './preview';
import Spreadsheet from './spreadsheet';

const rootEl = document.getElementById('root');
const store = createStore();

class Root extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = store.getState();
    this.clearError = this.clearError.bind(this);
    this.updateHTML = this.updateHTML.bind(this);
    this.updateCSS = this.updateCSS.bind(this);
  }

  render(): JSX.Element {
    const handleAction = store.dispatch.bind(store);

    const shareLink = () => {
      store.dispatch({ type: 'create-share-link' });
    };

    return (
      <div>
        <NotificationBar
          error={this.state.error}
          clearError={this.clearError} />
        <div className='left-panel'>
          <div className='table-panel'>
            <Spreadsheet
                {...this.state}
                handleAction={store.dispatch} />
          </div>
          <div className='html-panel'>
            <h3>HTML</h3>
            <MonacoEditor
              value={this.state.html}
              language='html'
              onSubmit={this.updateHTML} />
          </div>
          <div className='css-panel'>
            <h3>CSS</h3>
            <MonacoEditor
              value={this.state.css}
              language='css'
              onSubmit={this.updateCSS} />
          </div>
          <div className='js-panel'>
            <h3>JS</h3>
            <MonacoEditor
              value={this.state.js}
              language='javascript'
              onSubmit={this.updateJS} />
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
}

ReactDOM.render(<Root />, rootEl);
