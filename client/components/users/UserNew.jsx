import React from 'react';
import authService from '../login/service/authService';
import UserForm from './UserForm';

export default function UserNew() {
  const newUser = {
    username: '',
    password: '',
    isAdmin: false,
  };

  const onSubmit = async (userData) => {
    return await authService.signUp(userData);
  };


  return (
    <UserForm onSubmit={onSubmit} user={newUser}/>
  );
}

UserNew.propTypes = {};
