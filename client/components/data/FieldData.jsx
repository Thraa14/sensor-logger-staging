import React, { useState } from 'react';
import FieldSelector from './FieldSelector';
import 'typeface-roboto';
import Grid from '@material-ui/core/Grid';
import TablePage from './TablePage';

const debug = require('debug')('client:components:data:home');

export default function FieldData() {
  const [field, setField] = useState(null);

  const onFieldChange = (field) => {
    setField(field);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <Grid container direction={'column'} spacing={2}>
        <Grid item>
          <FieldSelector onFieldChange={onFieldChange}/>
        </Grid>
        {field && <TablePage fieldName={field.name}/>}
      </Grid>
    </div>
  );
}
