import React, { useState } from 'react';
import { ChatState } from '../../contextApi/ChatProvider';
import UserListItem from "../UserListItem/UserListItem";
import axios from 'axios';
import UserBadgeItem from '../UserBadgeItem/UserBadgeItem';
import { Box, Button, FormControl, Input, Modal, Typography, Fade } from '@mui/material';
import './groupChatModal.css';

const GroupChatModal = ({ open, handleClose }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        withCredentials: true, 
      };

      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${query}`, config
      );
      setLoading(false);
      setSearchResult(data);
      console.log(data);

    } catch (error) {
      alert('Failed loading search results: ' + error.message);
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      alert('Please fill all the fields');
      return;
    }
    try {
      const config = {
        withCredentials: true,
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/chat/group", {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((user) => user._id))
      }, config);

      setChats([data, ...chats]);
      alert('Group chat created successfully');
      handleClose();

    } catch (error) {
      alert('Failed to create the Chat: ' + error.message);
    }
  };

  const handleDelete = (userToDelete) => {
    setSelectedUsers(selectedUsers.filter(user => user._id !== userToDelete._id));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      alert('User is already added');
      return;
    } else {
      setSelectedUsers([...selectedUsers, userToAdd]);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className='group-add-modal'
    >
      <Fade in={open}>
        <Box className="group-add-modal-container">
          <Typography variant="h5" className="modal-title">
            Create Group Chat
          </Typography>
          <FormControl fullWidth className="form-control">
            <Input
              placeholder="Group Chat Name"
              onChange={(e) => setGroupChatName(e.target.value)}
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth className="form-control">
            <Input
              placeholder="Add Users to the Group Chat"
              onChange={(e) => handleSearch(e.target.value)}
              fullWidth
            />
          </FormControl>
          <Box className="user-badge-box">
            {selectedUsers.map((user) => (
              <UserBadgeItem
                key={user._id}
                user={user}
                handleFunction={() => handleDelete(user)}
              />
            ))}
          </Box>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            searchResult?.slice(0, 4).map((user) => (
              <UserListItem
                key={user._id}
                handleFunction={() => handleGroup(user)}
                user={user}
              />
            ))
          )}
          <Button fullWidth variant="contained" color="primary" onClick={handleSubmit}>
            Create Chat
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default GroupChatModal;
