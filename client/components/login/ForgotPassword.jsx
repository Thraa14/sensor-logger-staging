import React from 'react';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import proptypes from 'prop-types';

export default function ForgotPassword({ forgotPasswordUrl, signUpUrl }) {
  return (
    <Grid container>
      <Grid item xs>
        <Link href={forgotPasswordUrl} variant="body2">
          Forgot password?
        </Link>
      </Grid>
      <Grid item>
        <Link href={signUpUrl} variant="body2">
          {'Don\'t have an account? Sign Up'}
        </Link>
      </Grid>
    </Grid>
  );
}

ForgotPassword.propTypes = {
  forgotPasswordUrl: proptypes.string.isRequired,
  signUpUrl: proptypes.string.isRequired,
};
