import * as React from 'react';
import * as _ from 'underscore';

import {State as DataStoreState} from './datastore';
import * as utils from './utils';

interface Props extends DataStoreState {
}

function formatData(cells: string[][]): string {
  let maxCol = 0;
  let maxRow = 0;
  cells.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell) {
        maxRow = Math.max(i, maxRow);
        maxCol = Math.max(j, maxCol);
      }
    });
  });

  return _.range(0, maxRow + 1).map(
    row => _.range(0, maxCol + 1).map(col => cells[row][col]).join(','))
    .join('\n');
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

    const data = formatData(this.props.data);
    const fullJS = `const data = \`${data}\`;\n${this.props.js}`;
    indirectEval(fullJS);
  }

  componentDidMount() {
    this.componentDidUpdate(null);
  }
}
