import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import proptypes from 'prop-types';

import { NavLink, useRouteMatch } from 'react-router-dom';
import theme from './styles/theme';
import { appState } from './utils';
import { appRoutes } from './ProtectedRoute';

const debug = require('debug')('client:app:side-drawer');


const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  link: {
    color: theme.palette.secondary.main,
    textDecoration: 'none',
  },
});

export default function SideDrawer({ isOpen, setIsOpen }) {
  const classes = useStyles();
  const isAdmin = appState.isAdmin();
  const { path, url } = useRouteMatch();
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setIsOpen(open);
  };

  const list = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem>
          <ListItemText primary={'Integrate'}/>
        </ListItem>
        <Divider/>
        {appRoutes.map(({ name, pageUrl, requiresAdmin }, index) => {
          if (requiresAdmin && !isAdmin) {
            return null;
          } else {
            return (<NavLink
              key={index}
              className={classes.link}
              to={pageUrl}>
              <ListItem button>
                <ListItemText primary={name}/>
              </ListItem>
            </NavLink>);
          }
        })}
      </List>
    </div>
  );

  return (
    <>
      <Drawer
        anchor={'left'}
        open={isOpen}
        onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </>
  );
}

SideDrawer.propTypes = {
  isOpen: proptypes.bool.isRequired,
  setIsOpen: proptypes.func.isRequired,
};
