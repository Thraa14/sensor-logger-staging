import { Typography } from '@material-ui/core';
import propTypes from 'prop-types';
import React from 'react';

export function NamedObjectDetails({ object }) {
  return (
    <Typography variant={'body1'}>{object.name}</Typography>
  );
}

NamedObjectDetails.propTypes = {
  object: propTypes.shape({
    name: propTypes.string,
    _id: propTypes.string,
  }),
};
