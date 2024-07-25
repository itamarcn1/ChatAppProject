
import React, { useEffect, useState, useRef } from 'react';
import { ChatState } from '../../contextApi/ChatProvider';
import { getFullSender, getSender } from '../../config/ChatLogic';
import ProfileModal from '../ProfileModal/ProfileModal';
import UpdateGroupChatModal from '../UpdateGroupChatModal/UpdateGroupChatModal';
import axios from 'axios';
import io from 'socket.io-client'
import { Box, Button, FormControl, IconButton, Input, TextField, Typography, useMediaQuery } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import './singleChat.css'

const ENDPOINT = 'http://localhost:5000'
let socket, selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false)
  const { user, selectedChat, setSelectedChat } = ChatState();

  const messagesEndRef = useRef(null);


  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user._id);
    socket.on('connected', () => {
      setSocketConnected(true);
    })
  }, [])



  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  }




  const sendMessage = async (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && newMessage) {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        };
        const { data } = await axios.post(
          'http://localhost:5000/api/chat/message',
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit('new message', data, user._id);

        setNewMessage(''); 

      } catch (error) {
        console.log("failed to send message: " + error);
      }
    }
  };

  useEffect(() => {
    socket.on('message recieved', (chat) => {
      if (!selectedChatCompare || selectedChatCompare._id !== chat._id) {
        console.log("different chat");
        return
      }
      else {
        let newMessageReceived = chat.messages
        setMessages(newMessageReceived);

      }
    })
  })

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        withCredentials: true, 

      };
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/chat/${selectedChat._id}/messages`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit('join chat', selectedChat._id)
    } catch (error) {
      console.log("faled to fetch messages: " + error.message);
    }
  };

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat
  }, [selectedChat]);



  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };




  return (
    <>
      {selectedChat ? (
        <>
          <Box className="single-chat-container">

            <Box
              className="single-chat-back-icon"
            >
              <ArrowBackIcon
                color="secondary"
                fontSize='large'
                onClick={() => setSelectedChat('')}
              />
              <Box
                className="single-chat-profile-modal"
              >
                {!selectedChat.isGroupChat ? (
                  <ProfileModal
                    user={getFullSender(user, selectedChat.users)} 
                  />
                ) : (
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                )}
              </Box>
            </Box>
          </Box>
          <Box className="single-chat-message-container">
            {loading ? (
              <div className="single-chat-loading-spinner">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <Box className="single-chat-messages">
                {messages.map((msg, index) => (
                  <Box
                    key={index}
                    className={`single-chat-message ${msg.sender && msg.sender._id === user._id ? 'own' : 'other'}`}
                    bgcolor={msg.sender && msg.sender._id === user._id ? '#BEE3F8' : '#B9F5D0'}
                  >
                    <Typography
                      className={`single-chat-message-caption ${msg.sender && msg.sender._id === user._id ? 'own' : 'other'}`}
                      variant="caption"
                      color="gray"
                    >
                      {msg.sender._id === user._id ? 'Me' : msg.sender.name}
                    </Typography>

                    <Typography
                      className={`single-chat-message-content ${msg.sender && msg.sender._id === user._id ? 'own' : 'other'}`}
                      variant="body1"
                    >
                      {msg.content}
                    </Typography>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>
            )}

            <FormControl className="single-chat-message-input">
              <Box className="single-chat-message-input-container">
                <TextField
                  className="single-chat-input-field"
                  variant="outlined"
                  size='small'
                  margin='dense'
                  placeholder="Type a new message..."
                  onChange={typingHandler}
                  value={newMessage}
                />
                <Button
                  variant='contained'
                  color='success'
                  endIcon={<SendIcon />}
                  className="single-chat-send-button"
                  onClick={sendMessage}
                >
                  Send
                </Button>
              </Box>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box className="single-chat-empty-chat">
          <Typography className="single-chat-empty-chat-message">
            Click a chat to start chatting
          </Typography>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
