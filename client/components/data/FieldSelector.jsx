import React, { useEffect, useState } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import proptypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import fieldService from '../fields/services/fieldService';

const debug = require('debug')('client:app:data:fields');

export default function FieldSelector({ onFieldChange }) {
  const [fields, setFields] = useState(null);
  const [selectedField, setSelectedField] = useState();
  const updateSelectedField = (field) => {
    setSelectedField(field);
    onFieldChange(field);
  };

  const updateFields = async function() {
    if (fields !== null) {
      return;
    }

    const response = await fieldService.getFields();
    if (!response.isSuccess) {
      debug('Failed to fetch fields in selector');
      debug(response.errors);
      return;
    }

    const remoteFields = response.fields;
    updateSelectedField(remoteFields[0]);
    setFields(remoteFields);
  };

  useEffect(() => {
    async function fetch() {
      await updateFields();
    }

    fetch();
  }, []);

  const onSelectionChange = (event) => {
    const field = event.target.value;
    updateSelectedField(field);
  };
  const menuItem = () => {
    return (
      <>
        <InputLabel id="demo-simple-select-label">Field</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedField}
          renderValue={(v) => v.name}
          onChange={onSelectionChange}>
          {fieldMenuItems}
        </Select>
      </>
    );
  };

  const fieldMenuItems = fields === null ?
    <MenuItem disabled/> : (
      fields.map((f) => {
        return <MenuItem key={f._id} value={f}>{f.name}</MenuItem>;
      })
    );
  return (
    <>
      {
        fields ? menuItem() : <p>Loading...</p>
      }
    </>
  );
}

FieldSelector.propTypes = {
  onFieldChange: proptypes.func.isRequired,
};
