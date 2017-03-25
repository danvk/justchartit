import * as React from 'react';
import * as _ from 'underscore';

import {AppState as DataStoreState} from './datastore';
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

    const data = utils.formatData(this.props.data);
    const fullJS = `const data = \`${data}\`;\n${this.props.js}`;
    indirectEval(fullJS);
  }

  componentDidMount() {
    this.componentDidUpdate(null);
  }
}
