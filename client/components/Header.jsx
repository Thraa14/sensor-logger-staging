import React, { useState } from 'react';
import { Typography, AppBar, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { appState } from './utils';
import Button from '@material-ui/core/Button';
import proptypes from 'prop-types';
import Link from '@material-ui/core/Link';
import { NavLink, useRouteMatch } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SideDrawer from './SideDrawer';
import Grid from '@material-ui/core/Grid';
import authService from './login/service/authService';

const useStyles = makeStyles((theme) => ({
  typographyStyles: {
    flex: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  root: {
    flexGrow: 1,
  },
}));
// <Link to={`${url}/clients`}>Show clients</Link>
export default function Header({ history }) {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const logout = () => {
    appState.logout();
    authService.logout();
    history.push('/');
  };

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position={'static'} style={{ margin: 0 }}>
        <Toolbar>
          <IconButton
            onClick={() => {
              setDrawerIsOpen((s) => !s);
            }}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu">
            <MenuIcon/>
          </IconButton>
          <Grid container direction={'row'} spacing={1} alignItems={'baseline'}>
            <Grid item>
              <Link
                component={Link}
                style={{ color: 'white', textDecoration: 'none' }}
                to={'/app'}>
                Integrate DAS
              </Link>
            </Grid>
            <Grid item>
              <Typography
                className={classes.typographyStyles}>
                | {appState.user().username}
              </Typography>
            </Grid>
          </Grid>
          <Button
            onClick={logout} variant={'contained'}
            color={'secondary'}>
            <Typography>Logout</Typography>
          </Button>
        </Toolbar>
      </AppBar>
      <SideDrawer
        history={history} isOpen={drawerIsOpen}
        setIsOpen={setDrawerIsOpen}/>
    </div>
  );
}

Header.propTypes = {
  history: proptypes.any,
};
