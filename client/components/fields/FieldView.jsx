import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { NavLink } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { adaptManagers } from './utils';
import PositionedMenu from '../common/PositionedMenu';
import { useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import fieldService from './services/fieldService';
import SingleLineItems from '../common/SingleLineItems';
import { ConfirmModal } from '../common/ConfirmModal';


const debug = require('debug')('client:fields:view');

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: '30%',
    padding: '1.0em',
  },
}));


export default function FieldView({ field, notifyDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  field.managers = adaptManagers(field.managers);

  const NoteView = () => {
    if (!field.note) return null;
    return (
      <Grid item>
        <Typography>{field.note}</Typography>
      </Grid>
    );
  };

  const deleteField = async () => {
    debug('DELETE');
    debug(field);
    const response = await fieldService.deleteField({ _id: field._id });
    if (!response.isSuccess) {
      debug('Failed to delete field');
      debug(response.errors);
      return;
    }
    notifyDelete(field);
  };

  const menuItems = [
    {
      content: 'Edit',
      action: () => {
        history.push({
          pathname: '/app/fields/edit',
          state: { field: field },
        });
      },
    },
    {
      content: (
        <Box color={'red'} fontWeight={'fontWeightBold'}>
          <Typography>Delete</Typography>
        </Box>
      ),
      action: () => {
        setConfirmOpen(true);
      },
    },
  ];

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline/>
      <Card className={classes.card}>
        <CardHeader
          title={field.name}
          action={
            <PositionedMenu items={menuItems}/>
          }/>
        <CardContent>
          <Grid container direction={'column'} spacing={2}>
            <NoteView/>
            <SingleLineItems
              title={'Managers'} items={field.managers}
              mapper={(f) => f.name}/>
          </Grid>
        </CardContent>
        <CardActions>
          <Grid item container justify={'flex-end'} spacing={2}>
            <NavLink
              to={{
                pathname: `/app/data/${field.name}`,
                state: { fieldName: field.name },
              }}>
              <Button
                size={'small'}
                variant={'contained'}
                color={'secondary'}>Readings</Button>
            </NavLink>
          </Grid>
        </CardActions>
      </Card>
      <ConfirmModal
        title={'Confirm Deletion'}
        text={'Are you sure you want to delete this field and its readings?'}
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          await deleteField();
          setConfirmOpen(false);
        }}
      />
    </Container>
  );
}

FieldView.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string,
    note: PropTypes.string,
    managers: PropTypes.array,
    _id: PropTypes.string,
  }),
  notifyDelete: PropTypes.func.isRequired,
};
