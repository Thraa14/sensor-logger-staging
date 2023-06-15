import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { useHistory } from 'react-router-dom';
import { updateFieldValue } from '../utils';
import Grid from '@material-ui/core/Grid';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clientService from './services/clientService';

const debug = require('debug')('client:clients:new');

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  formTextInput: {
    minWidth: '30%',
  },
  spaced: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function ClientNew() {
  const classes = useStyles();
  const history = useHistory();
  const [name, setName] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const clientData = { name: name };
    const resp = await clientService.newClient(clientData);
    if (!resp.isSuccess) {
      debug('FAILED TO ADD NEW CLIENT');
      debug(resp.errors);
      return;
    }

    debug('ADDED NEW CLIENT');
    history.goBack();
  };

  return (

    <form
      className={classes.form}
      onSubmit={onSubmit}>
      <Grid container direction={'column'} spacing={2}>
        <Grid item>
          <Typography variant={'h4'}>New Client</Typography>
        </Grid>
        <Grid item>
          <TextField
            className={classes.formTextInput}
            value={name}
            name="clientName"
            variant="outlined"
            required
            onChange={(e) => updateFieldValue(e, setName)}
            id="filedName"
            label="Name"
            autoFocus
          />
        </Grid>
        <Grid
          item container direction={'row'} spacing={2}
          justify={'space-between'}>
          <Grid item>
            <Button
              variant="outlined"
              className={classes.spaced}
              color="primary">Clear</Button>
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.spaced}
            > Confirm </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}
