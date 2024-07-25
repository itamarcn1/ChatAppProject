import React, { useState } from 'react';
import { Avatar, Box, Button, Fade, Modal, Typography } from '@mui/material';
import './profileModal.css';
import UserListItem from '../UserListItem/UserListItem';

function ProfileModal({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const loggedUser = JSON.parse(localStorage.getItem('userInfo'))
  return (
    <>
      <Button variant="text" className="modal-button" onClick={() => setIsModalOpen(true)}>
        {user.name == loggedUser.name ? (<>
        <Avatar
          className="user-list-avatar"
          name={user.name}
          src={user.pic}
        />
        </>)
          :
          (user.name)
        }
      </Button>
      <Modal
        className='profile-modal'
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Fade in={isModalOpen}>
          <Box className="profile-modal-container">
            <Box className="user-avatar">
              <UserListItem user={user} sx={{ width: 100, height: 100 }} />
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default ProfileModal;
