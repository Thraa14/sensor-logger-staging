import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from './Header';
import proptypes from 'prop-types';
import ClientPage from './clients/ClientPage';
import ClientView from './clients/ClientView';
import ClientNew from './clients/ClientNew';
import UserNew from './users/UserNew';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import FieldEdit from './fields/FieldEdit';
import FieldNew from './fields/FieldNew';
import { appState } from './utils';
import AvailableFields from './fields/AvailableFields';
import UserPage from './users/UserPage';
import UserEdit from './users/UserEdit';
import FieldData from './data/FieldData';
import TablePage from './data/TablePage';

const debug = require('debug')('client:app');

// const debug = require('debug')('client:app');
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minHeight: '100%',
  },

}));
export default function App(props) {
  const classes = useStyles();
  const isAdmin = appState.isAdmin();

  const pageContent = () => (
    <Switch>
      {isAdmin && <Route exact path={'/app'} component={ClientPage}/>}
      {isAdmin && <Route path={'/app/clients'} component={ClientPage}/>}
      {isAdmin && <Route path={'/app/fields/new'} component={FieldNew}/>}
      {isAdmin && <Route path={'/app/clients/new'} component={ClientNew}/>}
      {isAdmin && <Route path={'/app/clients'} component={ClientView}/>}
      {isAdmin && <Route path={'/app/fields/edit'} component={FieldEdit}/>}
      {isAdmin && <Route path={'/app/users/new'} component={UserNew}/>}
      {isAdmin && <Route path={'/app/users/edit'} component={UserEdit}/>}
      {isAdmin && <Route path={'/app/users'} component={UserPage}/>}
      <Route path={'/app/data/fields'} component={AvailableFields}/>
      <Route path={'/app/data/:name'} component={TablePage}/>
      <Route path={'/app/data'} component={FieldData}/>
      <Route component={FieldData}/>
    </Switch>
  );

  return (
    <>
      <Box display="flex" flexDirection="column" marginBottom={'1.3em'}>
        <Header history={props.history}/>
      </Box>
      <Box height="90vh" display="flex" flexDirection="column">
        <div style={{ padding: '1rem' }}>
          {pageContent()}
        </div>
      </Box>
    </>
  );
}
App.propTypes = {
  history: proptypes.any,
};
