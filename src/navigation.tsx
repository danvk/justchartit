import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

interface Props {
  onRun(): any;
  onShare(): any;
}

interface State {
  drawerOpen: boolean;
}

class Navigation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      drawerOpen: false,
    }
    this.setDrawerOpen = this.setDrawerOpen.bind(this);
    this.openDrawer = this.openDrawer.bind(this);
  }

  render() {
    return (
      <div>
        <AppBar title='Just Chart It!' onLeftIconButtonTouchTap={this.openDrawer}>
          <ToolbarGroup firstChild={true}>
            <RaisedButton onClick={this.props.onRun} label='Run' />
            <RaisedButton onClick={this.props.onShare} label='Share' />
          </ToolbarGroup>
        </AppBar>
        <Drawer open={this.state.drawerOpen} docked={false} onRequestChange={this.setDrawerOpen}>
          <MenuItem>dygraphs</MenuItem>
          <MenuItem>Tutorial</MenuItem>
          <MenuItem>Options Reference</MenuItem>
          <MenuItem>API Reference</MenuItem>
          <MenuItem>Stack Overflow</MenuItem>
        </Drawer>
      </div>
    );
  }

  setDrawerOpen(drawerOpen: boolean) {
    this.setState({ drawerOpen });
  }

  openDrawer() {
    this.setDrawerOpen(true);
  }
}

export default Navigation;
