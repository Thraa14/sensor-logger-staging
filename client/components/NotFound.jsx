import React from 'react';
import Link from '@material-ui/core/Link';
import { useRouteMatch } from 'react-router-dom';

export default function NotFound() {
  const { path, url } = useRouteMatch();
  return (
    <>
      <h2>Opps!</h2>
      This page doesn't exist. <b>{url}</b>
      <br/>
      <Link to={'/'}>Back home</Link>
    </>
  );
}
