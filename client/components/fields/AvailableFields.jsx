import React, { useEffect, useState } from 'react';
import fieldService from './services/fieldService';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

const debug = require('debug')('client:fields:available');

export default function AvailableFields() {
  const [availableFields, setAvailableFields] = useState(undefined);

  useEffect(() => {
    async function fetch() {
      const response = await fieldService.getAvailableFields();
      if (!response.isSuccess) {
        debug('Failed to get all fields');
        debug(response.errors);
        return;
      }

      setAvailableFields(response.fields);
    }

    fetch();
  }, []);

  if (availableFields === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Grid
        spacing={2}
        container
        direction={'column'}>
        <Grid item>
          <Typography variant={'h5'}>Available fields</Typography>
        </Grid>
        <Grid item>
          <ul>
            {
              availableFields.map((f, i) => (
                <li key={i}>{f}</li>
              ))
            }
          </ul>
        </Grid>
      </Grid>
    </>
  );
}
