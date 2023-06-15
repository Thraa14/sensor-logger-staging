import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import PositionedMenu from '../common/PositionedMenu';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import React, { useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import userService from './services/userService';
import SingleLineItems from '../common/SingleLineItems';
import fieldService from '../fields/services/fieldService';
import { useHistory } from 'react-router-dom';
import { ConfirmModal } from '../common/ConfirmModal';

const debug = require('debug')('client:users:view');

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: '30%',
    padding: '1.0em',
  },
}));


export default function UserView({ user, notifyDelete }) {
  const classes = useStyles();
  const history = useHistory();
  const [fields, setFields] = useState(undefined);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    async function fetch() {
      const response = await fieldService.getFields();
      if (!response.isSuccess) {
        debug('Failed to fetch fields');
        debug(response.errors);
      }

      const fields = response.fields;
      setFields(fields);
    }

    fetch();
  }, []);

  const deleteUser = async () => {
    debug('DIRECT DELETE');
    debug(user);
    const response = await userService.deleteUser({ _id: user._id });
    if (!response.isSuccess) {
      debug('Failed to delete user');
      debug(response.errors);
      return;
    }
    notifyDelete(user);
  };

  if (fields === undefined) return <p>Loading...</p>;

  const menuItems = [
    {
      content: 'Edit',
      action: () => {
        history.push({
          pathname: '/app/users/edit',
          state: { user: user },
        });
      },
    },
    {
      content: (
        <Box color={'red'} fontWeight={'fontWeightBold'}>
          <Typography>Delete</Typography>
        </Box>
      ),
      action: () => {
        setConfirmOpen(true);
      },
    },
  ];
  return (
    <Container component="main" maxWidth="md">
      <CssBaseline/>
      <Card className={classes.card}>
        <CardHeader
          title={user.username}
          action={
            <PositionedMenu items={menuItems}/>
          }/>
        <CardContent>
          <Grid container direction={'column'} spacing={2}>
            <Typography>{user.isAdmin ?
              (<b>Admin User</b>) : 'User'}</Typography>
            <SingleLineItems
              title={'Fields'} items={fields}
              mapper={(f) => f.name}/>
          </Grid>
        </CardContent>
        <CardActions>
        </CardActions>
      </Card>
      <ConfirmModal
        title={'Confirm Deletion'}
        text={'Are you sure you want to delete this user?'}
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          await deleteUser();
          setConfirmOpen(false);
        }}
      />
    </Container>
  );
}

UserView.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    username: PropTypes.string,
    isAdmin: PropTypes.bool,
  }),
  notifyDelete: PropTypes.func.isRequired,
};
