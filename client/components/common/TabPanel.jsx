import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';

export const tabStyles = makeStyles((theme) => ({
  listItem: {
    alignContent: 'center',
  },
  root: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '100%',
  },
  tabPanel: {
    flex: 1,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  viewSection: {
    paddingTop: '1.4em',
  },
  accordionTitle: {
    fontWeight: 'bold',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));


export default function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}
