
import React, { useState, useEffect } from 'react';
import { ChatState } from '../../contextApi/ChatProvider';
import axios from 'axios';
import { ChatLoading } from '../ChatLoading/ChatLoading';
import { getSender, getFullSender } from "../../config/ChatLogic";
import { Avatar, Box, Stack, Typography } from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import './myChats.css';

export const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState('');
  const { user, setSelectedChat, chats, setChats, selectedChat } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        withCredentials: true,
      };
      const { data } = await axios.get('http://localhost:5000/api/chat', config);
      setChats(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setLoggedUser(JSON.parse(userInfo));
      fetchChats();
    } else {
      console.log('Error retrieving user info');
    }
  }, [fetchAgain]);

  return (
    <Box className="my-chats-container">
      <Box className="my-chats-box">
        <h1 variant="h4" className="my-chats-title">
        <ForumIcon
        sx={{marginRight:1}}
        />
          Recent Chats
        </h1>
        {chats ? (
          <Stack spacing={2}>
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`chat-item ${selectedChat === chat ? 'selected' : ''}`}
              >
                <Stack direction="row" alignItems="center">
                  {(!chat.isGroupChat) ? (
                    <Avatar sx={{ width: 40, height: 40 }} src={getFullSender(loggedUser, chat.users).pic} />
                  ) : (
                    <Avatar sx={{ width: 40, height: 40 }} />
                  )}
                  <Typography ml={2}>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

