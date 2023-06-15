import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { UserValidator } from '../common/proptypeDefs';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { validateUserData } from './utils';
import { useHistory } from 'react-router-dom';
import SubmitFormButton from '../common/SubmitFormButton';
import ModalMessage from '../common/ModalMessage';
import { api, appState } from '../utils';

const debug = require('debug')('client:users:form');

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function updateFieldValue(e, setter) {
  e.preventDefault();
  setter(e.target.value);
}

export default function UserForm({ user, onSubmit }) {
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(user.isAdmin);
  const [modalState, setModalState] = useState('initial');
  const [errors, setErrors] = useState([]);
  const classes = useStyles();
  const history = useHistory();

  async function onSubmitWrapper() {
    const userData = {
      username: username,
      isAdmin: isAdmin,
      password: password,
    };

    if (user._id !== undefined) {
      userData._id = user._id;
    }

    const errors = validateUserData(userData);
    if (errors.length) {
      debug(errors);
      setErrors(errors);
      setModalState('error');
      return;
    }

    const response = await onSubmit(userData);
    if (response.isSuccess) {
      setModalState('ok');
    } else {
      debug('Failed to save user');
      debug(response.errors);
      setErrors(errors);
      setModalState('error');
    }
  }

  const isEditingUser = () => user._id !== undefined;
  const passwordLabel = () => 'Password' +
    ((isEditingUser() && !password) ? ' (unchanged)' : '');
  const onCloseModal = () => {
    // User removed admin rights from themselves
    // Log them out and redirect.
    const isEditingSelf = appState.user().username === username;
    if (isEditingSelf && !isAdmin && modalState === 'ok') {
      api.logout();
      appState.logout();
      history.push('/');
    } else if (modalState === 'ok') {
      history.goBack();
    }
    setModalState('initial');
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline/>
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          User Details
        </Typography>
        <form className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="uname"
                name="userName"
                disabled={isEditingUser()}
                value={username}
                variant="outlined"
                required
                fullWidth
                onChange={(e) => updateFieldValue(e, setUsername)}
                id="userName"
                label="Username"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={(e) => updateFieldValue(e, setPassword)}
                variant="outlined"
                required
                fullWidth
                value={password}
                name="password"
                label={passwordLabel()}
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    name="isAdmin"
                    color="primary"
                  />
                }
                label="Administrator"
              />
            </Grid>
            <Grid item container direction={'row'} justify={'flex-end'}>
              <Grid item>
                <SubmitFormButton
                  color={'primary'}
                  variant={'contained'}
                  className={classes.submit}
                  doSubmit={onSubmitWrapper}>Save</SubmitFormButton>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </div>
      <ModalMessage
        errors={errors} state={modalState}
        onCloseModal={onCloseModal}/>
    </Container>
  );
}

UserForm.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool,
    _id: PropTypes.string,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
};
