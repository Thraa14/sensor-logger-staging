import React from 'react';
import PropTypes from 'prop-types';
import FieldForm from './FieldForm';
import fieldService from './services/fieldService';

const debug = require('debug')('client:fields:new');


export default function FieldNew({ location }) {
  debug('FIELD NEW');
  debug(location);
  const field = {
    name: '',
    note: '',
    managers: [],
  };
  const clientId = location.state.clientId;
  const onSubmit = async (fieldData) => {
    return await fieldService.newField(fieldData);
  };

  return <FieldForm field={field} clientId={clientId} onSubmit={onSubmit}/>;
}

FieldNew.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      clientId: PropTypes.string.isRequired,
    }),
  }),
};
