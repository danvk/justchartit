import * as React from 'react';
import * as _ from 'underscore';

import {AppState as DataStoreState} from './datastore';
import * as utils from './utils';

interface Props extends DataStoreState {
}

export default class Preview extends React.Component<Props, {}> {
  render(): JSX.Element {
    return (
      <iframe
          ref='frame'
          src='runner.html'
          sandbox='allow-scripts'
          onLoad={() => this.componentDidUpdate(null)}
          style={{width: '100%', height: '100%'}} />
    );
  }

  componentDidUpdate(prevProps: Props) {
    const { html, css, js, data } = this.props;
    const jsData = utils.formatData(data);
    const fullJS = `const data = \`${jsData}\`;\n${js}`;

    const frame = this.refs.frame as HTMLIFrameElement;
    frame.contentWindow.postMessage({ html, css, fullJS }, '*');
  }

  componentDidMount() {
    window.addEventListener('message', e => {
      const frame = this.refs.frame as HTMLIFrameElement;
      if (e.origin === "null" && e.source === frame.contentWindow) {
        console.log('message from iframe', e);
      }
    });
    this.componentDidUpdate(null);
  }
}
