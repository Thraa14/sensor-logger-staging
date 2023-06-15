import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default function SingleLineItems({ title, items, mapper }) {
  if (!items) return null;
  const names = items.map((m) => (
    mapper ? mapper(m) : m
  )).join(', ');

  return (
    <Grid item>
      <b>{title}</b>
      <Typography>{names}</Typography>
    </Grid>
  );
}

SingleLineItems.propTypes = {
  items: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  mapper: PropTypes.func,
};
