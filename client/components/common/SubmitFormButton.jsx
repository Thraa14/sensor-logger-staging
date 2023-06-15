import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SubmitButton({ doSubmit, onCheckBeforeSubmit, onAfterSubmit, ...props }) {
  const [canSubmit, setCanSubmit] = useState(true);
  const classes = useStyles();

  const onSubmit = async (e) => {
    e.preventDefault();
    // Check the checkBeforeSubmit exists and invoke it.
    if (onCheckBeforeSubmit && !onCheckBeforeSubmit()) {
      return;
    }
    setCanSubmit(false);
    await doSubmit();
    setCanSubmit(true);
    await onAfterSubmit?.();
  };

  return (<Button
    type={'submit'}
    disabled={!canSubmit}
    {...props}
    onClick={onSubmit}>Save</Button>);
}

SubmitButton.propTypes = {
  doSubmit: PropTypes.func.isRequired,
  onAfterSubmit: PropTypes.func,
  onCheckBeforeSubmit: PropTypes.func,
};
