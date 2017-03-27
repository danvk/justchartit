import * as React from 'react';
import * as _ from 'underscore';

import {AppState as DataStoreState} from './datastore';
import * as utils from './utils';

interface Props extends DataStoreState {
}

function makeFrameHTML(props: Props): string {
  const { html, css, js, data } = props;
  const jsData = utils.formatData(data);
  const fullJS = `const data = \`${jsData}\`;\n${js}`;

  return `<!doctype html>
<html>
<head>
  <meta charset='utf-8' />
  <link rel='stylesheet' href='dygraphs/dygraph.css' />
  <style>
${css}
  </style>
  <script src='dygraphs/dygraph.js'></script>
</head>
<body>
${html}
</body>
<script type='text/javascript'>
${fullJS}
</script>
</html>
  `;
}

export default class Preview extends React.Component<Props, {}> {
  render(): JSX.Element {
    return (
      <iframe
          ref='frame'
          sandbox='allow-scripts'
          frameBorder={0}
          style={{width: '100%', height: '100%'}} />
    );
  }

  componentDidUpdate(prevProps: Props) {
    const frame = this.refs.frame as HTMLIFrameElement;
    (frame as any).srcdoc = makeFrameHTML(this.props);
    // frame.contentWindow.postMessage({ html, css, fullJS }, '*');
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
