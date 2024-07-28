import React, { useEffect, useState } from 'react';
import { ChatState } from '../../contextApi/ChatProvider';
import ProfileModal from '../ProfileModal/ProfileModal.jsx';
import { useNavigate } from 'react-router-dom';
import { Box, Button, MenuItem, MenuList, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/ChatRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import { red } from '@mui/material/colors';
import { AddUserOrGroup } from '../AddUserOrGroup/AddUserOrGroup';
import './topBar.css';

export const TopBar = () => {
  const { user } = ChatState();
  const navigate = useNavigate();
  const [animateIcon, setAnimateIcon] = useState(false);

  useEffect(() => {
    if (user) {
      setAnimateIcon(true);
      setTimeout(() => setAnimateIcon(false), 1000); 
    }
  }, [user]);

  const logoutHandler = () => {
    navigate('/');
    localStorage.removeItem('userInfo');
    window.location.reload();
  };

  return (
    <Box className="top-bar-container">
      <Typography sx={{marginLeft:6}} variant="h4" className="top-bar-title">
        Chatter
        <ChatIcon className='top-bar-chat-icon'
        color='success'
        />
      </Typography>
      <div>
        <MenuList className="menu-list">
          <MenuItem>
            <div className={animateIcon ? 'add-icon-jump' : ''}>
              <AddUserOrGroup />
            </div>
          </MenuItem>
          <MenuItem>
            <ProfileModal user={user} />
          </MenuItem>
          <MenuItem>
            <LogoutIcon
            sx={{ color: red[500] }}
            onClick={logoutHandler}/>
          </MenuItem>
        </MenuList>
      </div>
    </Box>
  );
};
