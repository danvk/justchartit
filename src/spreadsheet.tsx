import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Action from './action';
import {State as DataStoreState} from './datastore';

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
      afterChange: (change, source) => {
        if (source === 'loadData') return;
        this.props.handleAction({
          type: 'set-cells',
          source,
          edits: change,
        });
      },
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
