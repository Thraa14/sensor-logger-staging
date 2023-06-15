import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TabPanel, { a11yProps, tabStyles } from '../common/TabPanel';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import UserNew from './UserNew';
import UserView from './UserView';
import userService from './services/userService';
import Grid from '@material-ui/core/Grid';
import UserNewCard from './UserNewCard';

const debug = require('debug')('user:users:page');

export default function UserPage() {
  const classes = tabStyles();
  const [users, setUsers] = useState(undefined);

  useEffect(() => {
    async function fetch() {
      const response = await userService.getUsers();
      if (!response.isSuccess) {
        debug('Failed to fetch users');
        debug(response.errors);
        return;
      }
      setUsers(response.users);
    }

    fetch();
  }, []);

  const notifyDelete = (user) => {
    setUsers((u) => {
      const updated = [...users];
      const index = u.indexOf(user);
      updated.splice(index, 1);
      return updated;
    });
  };

  if (users === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <div className={classes.root}>
      <Grid container direction={'column'} spacing={2}>
        {
          users?.map((u, i) => (
            <Grid item key={i}>
              <UserView notifyDelete={notifyDelete} user={u}/>
            </Grid>
          ))
        }
        <Grid item>
          <UserNewCard/>
        </Grid>
      </Grid>
    </div>
  );
}
