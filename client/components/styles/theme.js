import { createMuiTheme } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#d50000',
      light: '#ff5131',
      dark: '#9b0000',
    },
    secondary: blue,
  },
});

export default theme;
