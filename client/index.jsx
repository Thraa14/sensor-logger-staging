import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import { ThemeProvider } from '@material-ui/core/styles';
import { Route, Switch } from 'react-router-dom';
import theme from './components/styles/theme';
import CssBaseline from '@material-ui/core/CssBaseline';
import Login from './components/login/Login';
import ProtectedRoute from './components/ProtectedRoute';
import DebugRouter from './components/DebugRouter';
import NotFound from './components/NotFound';

localStorage.debug = 'client:*';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <DebugRouter>
      <CssBaseline/>
      <Switch>
        <Route exact path={'/'} component={Login}/>
        <ProtectedRoute path={'/app'} component={App}/>
        <Route component={NotFound}/>
      </Switch>
    </DebugRouter>
  </ThemeProvider>

  , document.getElementById('mountNode'));
