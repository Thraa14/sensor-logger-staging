import React, { useEffect, useState } from 'react';
import ClientView from './ClientView';
import PropTypes from 'prop-types';
import clientService from './services/clientService';

import ClientNew from './ClientNew';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel, { a11yProps, tabStyles } from '../common/TabPanel';

const debug = require('debug')('client:clients:page');

export default function ClientPage() {
  const classes = tabStyles();
  const [clients, setClients] = useState(undefined);
  const [tabNumber, setTabNumber] = useState(0);

  const handleChange = (event, newTabNumber) => {
    setTabNumber(newTabNumber);
  };

  useEffect(() => {
    async function fetch() {
      const response = await clientService.getClients();
      if (!response.isSuccess) {
        debug('FAILED TO FETCH CLIENTS');
        debug(response.errors);
        return;
      }
      setClients(response.clients);
      setTabNumber(0);
    }

    fetch();
  }, []);

  if (clients === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <div className={classes.root}>
      <Tabs
        orientation={'vertical'}
        variant={'scrollable'}
        value={tabNumber}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        className={classes.tabs}
        aria-label="scrollable auto tabs"
      >
        {
          clients?.map((c, i) => <Tab
            key={i}
            label={c.name} {...a11yProps(i)} />)
        }
        <Tab
          key={clients?.length || 0}
          label={'Add client'} {...a11yProps(clients?.length || 0)}/>
      </Tabs>
      {
        clients?.map((c, i) => <TabPanel
          className={classes.tabPanel}
          key={i} index={i}
          value={tabNumber}><ClientView client={c}/>
        </TabPanel>)
      }
      <TabPanel index={clients?.length || 0} value={tabNumber}>
        <ClientNew/>
      </TabPanel>
    </div>
  );
}
