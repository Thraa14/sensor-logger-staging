import { Redirect, Route } from 'react-router-dom';
import { api } from './utils';
import React from 'react';
import propTypes from 'prop-types';

const debug = require('debug')('client:app:protected-route');

export const appRoutes = [
  { name: 'Home', pageUrl: '/app', requiresAdmin: false },
  { name: 'Clients', pageUrl: '/app/clients', requiresAdmin: true },
  { name: 'Data', pageUrl: '/app/data', requiresAdmin: false },
  {
    name: 'Users', pageUrl: '/app/users',
    requiresAdmin: true,
  },
  {
    name: 'All fields', pageUrl: '/app/data/fields',
    requiresAdmin: false,
  },
];

export default function ProtectedRoute({ component: Component, ...rest }) {
  // TODO: handle expired token silently
  return (
    <Route {...rest} render={(props) => {
      if (api.isAuthenticated()) {
        return <Component {...props}/>;
      } else {
        return <Redirect
          to={{ pathname: '/', state: { from: props.location } }}/>;
      }
    }}/>
  );
}

ProtectedRoute.propTypes = {
  component: propTypes.any,
  path: propTypes.any.isRequired,
  location: propTypes.any,
};
