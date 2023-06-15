import React from 'react';
import PropTypes from 'prop-types';
import { api } from '../utils';
import FieldForm from './FieldForm';

const debug = require('debug')('client:fields:edit');

export default function FieldEdit({ location }) {
  debug('FIELD EDIT');
  debug(location.state.field);

  const onSubmit = async (fieldData) => {
    debug('FIELD EDIT');
    const response = await api.updateField(fieldData);
    debug(response);
    return response;
  };

  return <FieldForm
    field={location.state.field}
    onSubmit={onSubmit}/>;
}

FieldEdit.propTypes = {
  location: PropTypes.object,
};
