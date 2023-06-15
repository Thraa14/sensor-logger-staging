import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import PropTypes from 'prop-types';

const debug = require('debug')('client:common:namedObject:multiselect');

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: '100%',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

function getStyles(object, selectedObjects, theme) {
  return {
    fontWeight:
      selectedObjects
        .map((o) => o._id)
        .indexOf(object._id) === -1 ?
        theme.typography.fontWeightRegular :
        theme.typography.fontWeightMedium,
  };
}

export default function NamedObjectMultiSelect({
  objects,
  selectedObjects,
  objectClassName,
  onSelectionChange,
  ...rest
}) {
  const classes = useStyles();
  const theme = useTheme();

  const handleChange = (event) => {
    const unique = new Map();
    event.target.value.forEach((s) => {
      if (unique.has(s._id)) {
        unique.delete(s._id);
        return;
      }
      unique.set(s._id, s);
    });

    const selections = [];
    unique.forEach((v) => selections.push(v));
    onSelectionChange?.(selections);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel
          id="named-object-multiple-chip-label">{objectClassName}</InputLabel>
        <Select
          {...rest}
          labelId="named-object-multiple-chip-label"
          id="named-object-multiple-chip"
          multiple
          value={selectedObjects}
          onChange={handleChange}
          input={<Input id="select-multiple-chip"/>}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected.map((object, i) => (
                <Chip
                  key={i} label={object.name}
                  className={classes.chip}/>
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {objects.map((object, i) => (
            <MenuItem
              key={i} value={object}
              style={getStyles(object, selectedObjects, theme)}>
              {object.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

NamedObjectMultiSelect.propTypes = {
  objects: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  selectedObjects: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  objectClassName: PropTypes.string.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
};
