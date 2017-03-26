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
import Subheader from 'material-ui/Subheader';

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
              <MenuItem insetChildren={true} checked={layout === 'data-primary'} onTouchTap={() => onSetLayout('data-primary')}>Data primary</MenuItem>
            ]}>Layout</MenuItem>
            </Menu>
            <RaisedButton onClick={this.props.onRun} label='Run' />
            <RaisedButton onClick={this.props.onShare} label='Share' />
          </ToolbarGroup>
        </AppBar>
        <Drawer
            open={this.state.drawerOpen}
            onRequestChange={this.setDrawerOpen}
            docked={false} >
          <div style={styles.logo}>
            Just Chart It!
          </div>

          <Menu desktop>
            <Subheader>dygraphs resources</Subheader>
            <MenuItem target='_blank' href='http://dygraphs.com/options.html'>Options Reference</MenuItem>
            <MenuItem target='_blank' href='http://dygraphs.com/jsdoc/symbols/Dygraph.html'>API Reference</MenuItem>
            <MenuItem target='_blank' href='http://dygraphs.com/data.html'>Data Format reference</MenuItem>
            <MenuItem target='_blank' href='http://dygraphs.com/css.html'>CSS reference</MenuItem>
            <MenuItem target='_blank' href='http://stackoverflow.com/questions/tagged/dygraphs'>Stack Overflow</MenuItem>
            <MenuItem target='_blank' href='http://dygraphs.com/'>Web Site</MenuItem>
            <MenuItem target='_blank' href='http://blog.dygraphs.com/'>Blog</MenuItem>
            <MenuItem target='_blank' href='http://dygraphs.com/tutorial.html'>Tutorial</MenuItem>
            <Divider />
            <MenuItem>About Just Chart It</MenuItem>
          </Menu>
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
