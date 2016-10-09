import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'underscore';

import Action, {Edit} from './action';
import {State as DataStoreState} from './datastore';
import * as utils from './utils';

// import * as handsontable from 'handsontable';

interface Props extends DataStoreState {
  handleAction: (action: Action) => any;
}

interface State {

}

export default class Spreadsheet extends React.Component<Props, State> {
  table: ht.Methods;

  render() {
    return <div ref='table' className='spreadsheet'></div>;
  }

  componentDidMount() {
    const el = this.refs['table'] as HTMLDivElement;
    this.table = new Handsontable(el, {
      data: this.props.data,
      rowHeaders: true,
      colHeaders: true,
      contextMenu: true,
      fixedRowsTop: 1,
      fixedColumnsLeft: 1,
      manualColumnFreeze: true,
      manualColumnResize: true,
      undo: true,

      beforeChange: (changes: Edit[], source: string) => {
        if (source === 'paste' && changes.length) {
          // TODO: check that all the changes are to a single column.
          if (_.every(changes, change => change[3].indexOf(',') >= 0)) {
            const newChanges: Edit[] = [];
            for (const [row, col, old, csv] of changes) {
              const vals = csv.split(',');
              vals.forEach((val, i) => {
                newChanges.push([row, col + i, null, val]);
              });
            }
            changes.splice(0, changes.length, ...newChanges);
          }
        }
      },

      afterChange: (change, source) => {
        if (source === 'loadData') return;
        this.props.handleAction({
          type: 'set-cells',
          source,
          edits: change,
        });
      },

      allowInvalid: true,
      validator: function(cell: string, callback: (valid: boolean) => any) {
        const {row, col} = this;
        if (row >= 1 && col >= 1 && isNaN(Number(cell)) && cell !== 'NaN') {
          callback(false);
        } else {
          callback(true);
        }
      }
    });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.props.data !== prevProps.data) {
      // Note: we very much allow this.props.data to mutate internally without
      // updating the table. These changes typically reflect changes coming from the
      // table, rather than from replacing the data wholesale.
      this.table.updateSettings({
        data: this.props.data,
      }, false);
    }
  }
}
