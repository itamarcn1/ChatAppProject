import React from 'react';
import { Avatar, Box, Button, Typography } from '@mui/material';
import './userListItem.css';
import { LoggedUserProfile } from '../LoggedUserProfile/LoggedUserProfile';

const UserListItem = ({ user, handleFunction }) => {
  const loggedUser = JSON.parse(localStorage.getItem('userInfo'))

  return (
    <Box
      onClick={handleFunction}
      className="user-list-item"
    >
      {user.name == loggedUser.name ? (<LoggedUserProfile/>)
        :
        (<>
          <Avatar
            className="user-list-avatar"
            name={user.name}
            src={user.pic}
          />
          <Box>
            <Typography>{user.name}</Typography>
            <Typography className="user-email" fontSize="xs">
              <b>Email:</b> {user.email}
            </Typography>
          </Box>

    </>)
}
        </Box>
  );
};

export default UserListItem;
