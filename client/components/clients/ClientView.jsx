import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import FieldView from '../fields/FieldView';
import FieldNewCard from '../fields/FieldNewCard';
import clientService from './services/clientService';

const debug = require('debug')('client:clients:details');


export default function ClientView(props) {
  const client = props.client ? props.client : props.location.state.client;
  const [fields, setFields] = useState(undefined);

  useEffect(() => {
    async function fetch(clientId) {
      const response = await clientService.getClient(clientId);

      if (!response.isSuccess) {
        debug('Failed to fetch client');
        debug(response.errors);
        return;
      }
      debug('fetch client');
      const client = response.client;
      debug(client);
      setFields(client.fields);
    }

    fetch(client._id);
  }, [client]);

  if (fields === undefined) return <p>Loading...</p>;

  const notifyFieldDeletion = (field) => {
    setFields((f) => {
      const updated = [...fields];
      const index = f.indexOf(field);
      updated.splice(index, 1);
      return updated;
    });
  };

  const renderFields = function(fields) {
    if (!fields) return null;
    return (
      fields.map((f, i) => (
        <Grid key={i} item>
          <FieldView field={f} notifyDelete={notifyFieldDeletion}/>
        </Grid>
      ))
    );
  };

  const renderHeader = function(name) {
    return (
      <Grid
        item
        container
        direction={'row'}
        alignItems={'center'}
        justify={'space-between'}>
        <Grid item>
          <Typography variant={'h4'}>{client.name}</Typography>
        </Grid>
        <Grid item>
          {/*<Typography>TODO: EDIT NAME</Typography>*/}
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <Grid
        container
        spacing={3}>
        {renderHeader(name)}
        <Grid item container direction={'column'} spacing={2}>
          {renderFields(fields)}
          <Grid item>
            <FieldNewCard clientId={client._id}/>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

ClientView.propTypes = {
  location: PropTypes.object,
  client: PropTypes.object,
  users: PropTypes.array,
};
