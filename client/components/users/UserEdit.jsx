import React from 'react';
import PropTypes from 'prop-types';
import UserForm from './UserForm';
import authService from '../login/service/authService';

const debug = require('debug')('client:users:form');

export default function UserEdit({ location }) {
  const user = location.state.user;


  const onSubmit = async (userData) => {
    return await authService.updateUser(userData);
  };

  debug('EditUser');
  debug(user);

  return (
    <UserForm onSubmit={onSubmit} user={user}/>
  );
}

UserEdit.propTypes = {
  location: PropTypes.object.isRequired,
};
