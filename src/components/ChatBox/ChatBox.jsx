import React from 'react';
import { ChatState } from "../../contextApi/ChatProvider";
import SingleChat from '../SingleChat/SingleChat';
import { Box } from '@mui/material';
import './chatBox.css'

export const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      className={`chat-box ${!selectedChat ? 'chat-box-hidden' : ''} ${selectedChat ? 'chat-box-md' : ''}`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};