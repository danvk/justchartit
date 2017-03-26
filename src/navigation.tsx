import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import DropDownMenu from 'material-ui/DropDownMenu';
import Popover from 'material-ui/Popover';

import {spacing, typography, zIndex} from 'material-ui/styles';
import {cyan500} from 'material-ui/styles/colors';

import { Layout } from './action';

const styles = {
  logo: {
    cursor: 'pointer',
    fontSize: 24,
    color: typography.textFullWhite,
    lineHeight: `${spacing.desktopKeylineIncrement}px`,
    fontWeight: typography.fontWeightLight,
    backgroundColor: cyan500,
    paddingLeft: spacing.desktopGutter,
    marginBottom: 8,
  },
};

interface Props {
  onRun(): any;
  onShare(): any;
  onSetLayout(layout: Layout): any;
  layout: Layout;
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
    const { layout, onSetLayout } = this.props;
    return (
      <div>
        <AppBar title='Just Chart It!' onLeftIconButtonTouchTap={this.openDrawer}>
          <ToolbarGroup firstChild={true}>
            <Menu>
              <MenuItem rightIcon={<ArrowDropRight/>} menuItems={[
              <MenuItem insetChildren={true} checked={layout === 'default'} onTouchTap={() => onSetLayout('default')}>Default</MenuItem>,
              <MenuItem insetChildren={true} checked={layout === 'js-primary'} onTouchTap={() => onSetLayout('js-primary')}>JS primary</MenuItem>
            ]}>Layout</MenuItem>
            </Menu>
            <RaisedButton onClick={this.props.onRun} label='Run' />
            <RaisedButton onClick={this.props.onShare} label='Share' />
          </ToolbarGroup>
        </AppBar>
        <Drawer
            open={this.state.drawerOpen}
            onRequestChange={this.setDrawerOpen}
            docked={false}
        >
          <div style={styles.logo}>
            Just Chart It!
          </div>

          <Divider />
          <MenuItem disabled={true}>dygraphs resources</MenuItem>
          <MenuItem insetChildren={true}>Options Reference</MenuItem>
          <MenuItem insetChildren={true}>API Reference</MenuItem>
          <MenuItem insetChildren={true}>Stack Overflow</MenuItem>
          <MenuItem insetChildren={true} href='http://dygraphs.com/'>Web Site</MenuItem>
          <MenuItem insetChildren={true}>Blog</MenuItem>
          <MenuItem insetChildren={true}>Tutorial</MenuItem>
          <Divider />
          <MenuItem>About Just Chart It</MenuItem>
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

  onChangeLayout(e: any, i: number, value: Layout) {
    this.props.onSetLayout(value);
  }
}

export default Navigation;
