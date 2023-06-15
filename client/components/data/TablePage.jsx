import Grid from '@material-ui/core/Grid';
import DataTable from './DataTable';
import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import LiveReadingTable from './LiveReadingTable';

const debug = require('debug')('client:data:page');

export default function TablePage({ fieldName, location }) {
  debug('props');
  debug(fieldName, location);
  const name = fieldName ? fieldName : location.state.fieldName;
  return (
    <>
      <Grid container spacing={1} direction={'column'}>
        {/*
        Display field name only when displaying
        the page without field selector
        */}
        {
          !fieldName &&
          <Grid item><Typography variant={'h5'}>{name}</Typography></Grid>
        }
        <Grid item>
          <LiveReadingTable fieldName={name}/>
        </Grid>
        <Grid item>
          <DataTable fieldName={name}/>
        </Grid>
      </Grid>
    </>
  );
}
TablePage.propTypes = {
  fieldName: PropTypes.string,
  location: PropTypes.object,
};
