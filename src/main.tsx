import * as React from 'react';
import * as ReactDOM from 'react-dom';

import createStore, {State} from './datastore';
import NotificationBar from './notification-bar';

const rootEl = document.getElementById('root');
const store = createStore();

class Root extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = store.getState();
    this.clearError = this.clearError.bind(this);
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
        <div className='table-panel'>
          table
        </div>
        <div className='html-panel'>
          HTML
        </div>
        <div className='css-panel'>
          CSS
        </div>
        <div className='js-panel'>
          JS
        </div>
        <div className='output-panel'>
          Output
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
}

ReactDOM.render(<Root />, rootEl);
