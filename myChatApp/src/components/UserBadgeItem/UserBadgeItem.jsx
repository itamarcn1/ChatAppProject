import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton } from '@mui/material';
import './userBadgeItem.css';

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box className='user-badge-container'>
    <Box className="user-badge-item" onClick={handleFunction}>
      <span className="user-name">{user.name}</span>
      <IconButton className="close-icon" size="small">
        <CloseIcon />
      </IconButton>
    </Box>
    </Box>
  );
};

export default UserBadgeItem;
