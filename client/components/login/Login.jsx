import proptypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockIcon from '@material-ui/icons/Lock';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { api, appState } from '../utils';
import Modal from '@material-ui/core/Modal';
import authService from './service/authService';
import { validateLoginData } from './utils';
import ModalMessage from '../common/ModalMessage';

const debug = require('debug')('client:components:login');

function Username({ username, onUsernameChange }) {
  return (
    <TextField
      value={username}
      onChange={onUsernameChange}
      variant="outlined"
      margin="normal"
      required
      fullWidth
      id="username"
      label="Username"
      name="username"
      autoComplete="username"
      autoFocus
    />
  );
}

Username.propTypes = {
  username: proptypes.string.isRequired,
  onUsernameChange: proptypes.func,
};

function Password({ password, onPasswordChange }) {
  return (
    <TextField
      value={password}
      onChange={onPasswordChange}
      variant="outlined"
      margin="normal"
      required
      fullWidth
      name="password"
      label="Password"
      type="password"
      id="password"
      autoComplete="current-password"
    />
  );
}

Password.propTypes = {
  password: proptypes.string.isRequired,
  onPasswordChange: proptypes.func,
};

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="http://integrate-das.com">
        Integrate DAS
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

export default function Login({ history }) {
  const [modalStyle] = React.useState(getModalStyle);
  const [username, setUsername] = useState('');
  const [modalState, setModalState] = useState('initial');
  const [errors, setErrors] = useState([]);
  const [password, setPassword] = useState('');
  const [errLogin, setErrLogin] = useState(false);
  // const {path, url} =
  const classes = useStyles();

  useEffect(() => {
    if (appState.isLoggedIn()) {
      api.setAuthorizationToken(appState.token());
      redirectWithPrivileges();
    }
  }, []);

  const onUsernameChange = (e) => {
    e.preventDefault();
    setUsername(e.target.value);
  };

  const onPasswordChange = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const redirectWithPrivileges = () => {
    if (appState.isAdmin()) {
      history.push('/app');
    } else {
      history.push('/app/data');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // TODO: update to use
    const params = {
      username: username,
      password: password,
    };

    const errors = validateLoginData(params);
    if (errors.length !== 0) {
      debug(errors);
      setErrors(errors);
      setModalState('error');
      return;
    }

    const response = await authService.login(params);
    if (!response.isSuccess) {
      debug('Failed to login');
      setErrors(response.errors);
      setModalState('error');
      return;
    }

    const user = response.user;
    const token = response.token;
    authService.authenticate(token);
    appState.login(user, token);
    redirectWithPrivileges();
  };

  const onCloseModal = () => setModalState('initial');

  const body = (
    <div style={modalStyle} className={classes.modal}>
      <h2 id="simple-modal-title">Login Error</h2>
      <p id="simple-modal-description">
        Invalid username or password
      </p>
      <Button
        variant={'contained'}
        color={'secondary'}
        onClick={() => setErrLogin(false)}>Ok</Button>
    </div>
  );

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form
          className={classes.form}
          onSubmit={onSubmit}
          noValidate>
          <Username username={username} onUsernameChange={onUsernameChange}/>
          <Password password={password} onPasswordChange={onPasswordChange}/>
          <Modal
            open={errLogin}
            onClose={() => setErrLogin(false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            {body}
          </Modal>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          {/* <ForgotPassword forgotPasswordUrl={'#'} signUpUrl={'#'}/>*/}
        </form>
      </div>
      <Box mt={8}>
        <Copyright/>
      </Box>
      <ModalMessage
        errors={errors} state={modalState}
        onCloseModal={onCloseModal}/>
    </Container>
  );
}
Login.propTypes = {
  history: proptypes.any,
};
