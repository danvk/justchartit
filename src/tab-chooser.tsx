import * as React from 'react';

interface Props {
  tabs: string[];
  selectedTab: string;
  onChange: (tab: string) => any;
}

export default class TabChooser extends React.Component<Props, {}> {
  render() {
    const links = this.props.tabs.map((tab, i) => (
      tab === this.props.selectedTab ?
        <b key={i}>{tab}</b> :
        <a key={i} href='#' onClick={() => this.props.onChange(tab)}>{tab}</a>
    ));
    return <div className='tab-chooser'>{links}</div>;
  }
}
