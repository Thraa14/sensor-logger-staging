import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: '30%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  breakableText: {
    whiteSpace: 'pre-line',
  },
}));

export function TextModal({ title, text, open, onConfirm }) {
  const classes = useStyles();
  const body = (
    <div className={classes.modal}>
      <Grid container direction={'column'} spacing={2}>
        <Grid item>
          <Typography
            variant={'h4'}
            className={classes.breakableText}
            id="text-modal-title">{title}</Typography>
        </Grid>
        <Grid item>
          <Typography
            id="text-modal-description"
            className={classes.breakableText}>
            {text}
          </Typography>
        </Grid>
        <Grid item container direction={'row'} justify={'flex-end'}>
          <Button
            variant={'contained'}
            color={'secondary'}
            onClick={onConfirm}>Ok</Button>
        </Grid>
      </Grid>
    </div>
  );

  return (
    <Modal
      open={open}
      aria-labelledby="text-modal-title"
      aria-describedby="text-modal-description">
      {body}
    </Modal>
  );
}

TextModal.propTypes = {
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func,
};
