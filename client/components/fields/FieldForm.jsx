import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { UserService } from '../clients/services/userService';
import NamedObjectMultiSelect from '../common/NamedObjectMultiSelect';
import { adaptManagers, validateFieldData } from './utils';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import SubmitFormButton from '../common/SubmitFormButton';
import { TextModal } from '../common/TextModal';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { modalStates } from '../utils';

const debug = require('debug')('client:fields:form');
const userFetcher = new UserService();

function ManagerMultiSelect({
  managers,
  selectedManagers,
  onSelectionChange,
  ...rest
}) {
  console.assert(selectedManagers, 'No selected managers');
  console.assert(managers, 'No managers');
  return (<NamedObjectMultiSelect
    {...rest}
    objects={managers}
    selectedObjects={selectedManagers}
    objectClassName={'Managers'}
    onSelectionChange={onSelectionChange}
  />);
}

ManagerMultiSelect.propTypes = {
  managers: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  })),
  selectedManagers: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  })),
  onSelectionChange: PropTypes.func,
};

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  spacer: {
    flex: 1,
  },
}));

export default function FieldForm({ field, clientId, onSubmit }) {
  const classes = useStyles();
  const history = useHistory();
  const [name, setName] = useState(field.name);
  const [note, setNote] = useState(field.note);
  const [managers, setManagers] = useState(adaptManagers(field.managers));
  const [users, setUsers] = useState(null);
  const [modalState, setModalState] = useState(modalStates.initial);

  useEffect(() => {
    async function fetch() {
      const response = await userFetcher.fetchUsers();
      if (!response.isSuccess) {
        debug('Failed to fetch users');
        debug(response.errors);
        return;
      }
      const users = adaptManagers(response.users);
      setUsers(users);
    }

    fetch();
  }, []);

  async function onSubmitWrapper() {
    const fieldData = {
      clientId: clientId,
      name: name,
      note: note,
      // TODO: check manager fields that originally came from BE
      // e.g. received manager with full data and conflicts
      managers: managers.map((m) => m._id),
    };

    const updatedField = Object.assign(field, fieldData);
    const errors = validateFieldData(updatedField);

    if (errors.length) {
      setModalState(modalStates.error(errors));
      return;
    }
    debug('Submitting');
    debug(updatedField);
    const onSubmitResult = await onSubmit(updatedField);
    if (onSubmitResult.isSuccess) {
      setModalState(modalStates.ok);
    } else {
      setModalState(modalStates.error(onSubmitResult.errors));
    }
  }

  const onCloseModal = () => {
    setModalState(modalStates.initial);
    if (modalState.willGoBack) {
      history.goBack();
    }
  };

  if (users === null) return <p>Loading...</p>;

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline/>
      <Grid
        item
        container
        direction={'column'}
        spacing={6}>
        <Grid item>
          <Typography variant={'h4'}>
            Field Data
          </Typography>
        </Grid>
        <form className={classes.form}>
          <Grid item/>
          <Grid item xs={12}>
            <TextField
              value={name}
              name="fieldName"
              variant="outlined"
              required
              fullWidth
              onChange={(e) => setName(e.target.value)}
              id="filedName"
              label="Name"
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <ManagerMultiSelect
              selectedManagers={managers}
              onSelectionChange={
                (managers) => setManagers(managers)
              }
              managers={users}/>
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={note}
              onChange={(e) => setNote(e.target.value)}
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              name="note"
              label="Note"
              type="text"
              id="note"
            />
          </Grid>
          <Grid item/>
          <Grid item container direction={'row'} justify={'flex-end'}>
            <Grid item>
              <SubmitFormButton
                color={'primary'}
                variant={'contained'}
                className={classes.submit}
                doSubmit={onSubmitWrapper}>Save</SubmitFormButton>
            </Grid>
          </Grid>
        </form>
      </Grid>
      {/* // TODO: use ModalMessage */}
      <TextModal
        title={modalState.title}
        text={modalState.text}
        open={modalState.open}
        onConfirm={onCloseModal}/>
    </Container>
  );
}

FieldForm.propTypes = {
  field: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string.isRequired,
    note: PropTypes.string.isRequired,
    managers: PropTypes.array.isRequired,
  }),
  clientId: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};
