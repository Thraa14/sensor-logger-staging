import React from 'react';
import PropTypes from 'prop-types';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { IconButton } from '@material-ui/core';

export default function PositionedMenu({ items }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        onClick={handleClick}
        aria-controls="positioned-menu" aria-haspopup="true">
        <MoreVertIcon/>
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {
          items.map(({ content, action }, i) => (
            <MenuItem
              key={i}
              onClick={() => {
                action(i);
                handleClose();
              }}>{content}</MenuItem>
          ))
        }
      </Menu>
    </div>
  );
}

PositionedMenu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    action: PropTypes.func.isRequired,
    content: PropTypes.oneOfType(
      [PropTypes.string, PropTypes.object],
    ).isRequired,
  })),
};
