import React, { useState } from 'react';
import { ChatState } from '../../contextApi/ChatProvider';
import UserListItem from '../UserListItem/UserListItem';
import { ChatLoading } from '../ChatLoading/ChatLoading'
import axios from 'axios';
import { Box, Button, Input, Tooltip, Typography, Modal, Fade } from '@mui/material';
import './addChatModal.css';

export const AddChatModal = ({ open, handleClose }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, setSelectedChat, chats, setChats } = ChatState();

  const handleSearch = async () => {
    if (!search) {
      alert("Please enter a search term");
      return;
    }
    try {
      setLoading(true);
      const config = {
        withCredentials: true, 
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`, config
      );
      setLoading(false);
      setSearchResult(data);

    } catch (error) {
      console.log("failed loading results: " + error);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/chat`, { userId },
        config
      );
      console.log(data);

      if (!chats.find((chat) => chat._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      handleClose(); 

    } catch (error) {
      console.log("error fetching chat " + error);
      setLoadingChat(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Fade in={open}>
          <Box className='modal-box' >
            <Typography className='add-chat-title' variant="h5" mb={2}>Add Users</Typography>
            <Box mb={2}>
              <Input
                fullWidth
                placeholder='Search by name or email'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              <Button onClick={handleSearch} fullWidth variant="contained" color="primary"  className="search-button">Search</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <ChatLoading />}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};
