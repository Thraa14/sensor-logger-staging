import React from 'react';
import propTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

export default function NamedObjectDropdown({
  objectClassName,
  objects,
  onSelectionChange,
}) {
  const objectMenuItems = objects.map((o) =>
    <MenuItem
      key={o._id}
      value={o}>{o.name}
    </MenuItem>,
  );

  return (
    <>
      <InputLabel id="demo-simple-select-label">{objectClassName}</InputLabel>
      <Select
        fullWidth
        labelId="object-simple-select-label"
        id="object-simple-select"
        value={objects[0]}
        onChange={onSelectionChange}
        renderValue={(v) => v.name}>
        {objectMenuItems}
      </Select>
    </>
  );
}

NamedObjectDropdown.propTypes = {
  objects: propTypes.array.isRequired,
  objectClassName: propTypes.string.isRequired,
  onSelectionChange: propTypes.func,
};
