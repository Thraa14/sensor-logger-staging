import React from 'react';
import Grid from '@material-ui/core/Grid';
import proptypes from 'prop-types';


export default function LastReading({ lastReadingTime }) {

  return (
    <>
      <Grid
        item container
        alignItems={'center'}
        justify={'center'}
        spacing={2}>
        <Grid item>
          <b>Last reading</b>
        </Grid>
        <Grid item>
          <p>{lastReadingTime}</p>
        </Grid>
        <Grid item>
          <small>(first row)</small>
        </Grid>
      </Grid>
    </>
  );
}

LastReading.propTypes = {
  lastReadingTime: proptypes.string.isRequired,
};
