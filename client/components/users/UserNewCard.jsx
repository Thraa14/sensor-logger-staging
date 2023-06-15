import React from 'react';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import { NavLink } from 'react-router-dom';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: '30%',
    padding: '1.0em',
  },
}));


export default function UserNewCard() {
  const classes = useStyles();

  return (<Container component="main" maxWidth="md">
    <CssBaseline/>
    <Card className={classes.card}>
      <CardHeader
        title={'Add'}/>
      <CardContent>
        <Grid container justify={'space-around'}>
          <NavLink to={'/app/users/new'}>
            <Button
              variant={'contained'}
              color={'secondary'}
              size={'large'}
              startIcon={<AddCircleIcon fontSize={'large'}/>}>
              New user
            </Button>
          </NavLink>
        </Grid>
      </CardContent>
    </Card>
  </Container>);
}

UserNewCard.propTypes = {};
