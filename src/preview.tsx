import * as React from 'react';

import {State as DataStoreState} from './datastore';
import * as utils from './utils';

interface Props extends DataStoreState {
}

export default class Preview extends React.Component<Props, {}> {
  render(): JSX.Element {
    return (
      <div>
        <style type='text/css'>{this.props.css}</style>
        <div dangerouslySetInnerHTML={{__html: this.props.html}} />
      </div>
    );
  }

  componentDidUpdate(prevProps: Props) {
    const indirectEval = eval;
    const data = this.props.data.map(row => row.join(',')).join('\n');
    const fullJS = `const data = \`${data}\`;\n${this.props.js}`;
    console.log(fullJS);
    indirectEval(fullJS);
  }
}
