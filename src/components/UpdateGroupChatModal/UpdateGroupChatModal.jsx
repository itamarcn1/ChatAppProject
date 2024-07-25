import React, { useState } from 'react';
import { ChatState } from '../../contextApi/ChatProvider';
import UserBadgeItem from '../UserBadgeItem/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserListItem/UserListItem';
import {
    Box,
    Button,
    FormControl,
    Input,
    Modal,
    Typography,
    Backdrop,
    Fade,
    CircularProgress,
    Snackbar,
} from '@mui/material';
import './updateGroupChatModal.css';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { user, selectedChat, setSelectedChat } = ChatState();
    const [groupChatName, setGroupChatName] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showUsers, setShowUsers] = useState(false);

    const handleOpen = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);

    const toggleShowUsers = () => setShowUsers(!showUsers);

    const showToast = (message, status) => {
        setToastMessage({ message, status });
        setTimeout(() => setToastMessage(''), 5000);
    };

    const handleRemove = async (currentUser) => {
        if (selectedChat.groupAdmin._id !== user._id && currentUser._id !== user._id) {
            showToast('Only Admins can remove a member!', 'error');
            return;
        }

        try {
            setLoading(true);
            const config = {
                withCredentials: true, 
            };
            const { data } = await axios.put(
                'http://localhost:5000/api/chat/group-remove',
                { chatId: selectedChat._id, userId: currentUser._id },
                config
            );
            currentUser._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            showToast('Something went wrong', 'error');
            setLoading(false);
        }
    };

    const handleAddUser = async (currentUser) => {
        if (selectedChat.users.find((u) => u._id === currentUser._id)) {
            showToast('User already in the group!', 'error');
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            showToast('Only the group admin can add users!', 'error');
            return;
        }

        try {
            setLoading(true);
            const config = {
                withCredentials: true, 
            };
            const { data } = await axios.put(
                'http://localhost:5000/api/chat/add-to-group',
                { chatId: selectedChat._id, userId: currentUser._id },
                config
            );
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            showToast('Something went wrong', 'error');
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);
            const config = {
                withCredentials: true, 
            };
            const { data } = await axios.put(
                'http://localhost:5000/api/chat/rename-group',
                { chatId: selectedChat._id, chatName: groupChatName },
                config
            );
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            showToast('Something went wrong', 'error');
            setRenameLoading(false);
            setGroupChatName('');
        }
    };

    const handleSearch = async (query) => {
        if (!query) return;

        try {
            setLoading(true);
            const config = {
                withCredentials: true, 
            };
            const { data } = await axios.get(`http://localhost:5000/api/user?search=${query}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            showToast('Failed loading search results', 'error');
            setLoading(false);
        }
    };

    return (
        <>
            <Button className="group-chat-button" onClick={handleOpen}>
                {selectedChat.chatName}
            </Button>

            <Modal
                className='group-modal'
                open={isModalOpen}
                onClose={handleClose}
                closeAfterTransition
            >
                <Fade in={isModalOpen}>
                    <Box className="group-modal-container">
                        <Typography className="modal-header" variant="h5">
                            {selectedChat.chatName}
                        </Typography>
                        <Box className="modal-body">
                            <Button onClick={toggleShowUsers}>
                                {showUsers ? 'Hide Current Users in Group' : 'Show Current Users in Group'}
                            </Button>
                            {showUsers && (
                                <Box className="user-badge-container">
                                    {selectedChat.users.map((user) => (
                                        <UserBadgeItem
                                            key={user._id}
                                            user={user}
                                            handleFunction={() => handleRemove(user)}
                                        />
                                    ))}
                                </Box>
                            )}
                            <FormControl className='chat-name-form' >
                                <Input className="chat-name-input"
                                    placeholder="Chat Name"
                                    value={groupChatName}
                                    onChange={(e) => setGroupChatName(e.target.value)}
                                />
                                <Button className="chat-name-button"
                                    variant="contained"
                                    color="primary"
                                    onClick={handleRename}
                                    disabled={renameLoading}
                                >
                                    {renameLoading ? <CircularProgress size={24} /> : 'Update'}
                                </Button>
                            </FormControl>
                            <FormControl className="add-user-input">
                                <Input
                                    placeholder="Add User to group"
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </FormControl>
                            {loading ? (
                                <Box className="circular-progress">
                                    <CircularProgress size={24} />
                                </Box>
                            ) : (
                                searchResult.map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleAddUser(user)}
                                    />
                                ))
                            )}
                        </Box>
                        <Box className="modal-footer">
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleRemove(user)}
                            >
                                Leave Group
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            {toastMessage && (
                <Snackbar
                    open={!!toastMessage}
                    message={toastMessage.message}
                    autoHideDuration={5000}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    ContentProps={{
                        style: {
                            backgroundColor: toastMessage.status === 'error' ? '#d32f2f' : '#388e3c',
                            color: '#fff',
                            padding: '10px 20px',
                            borderRadius: '5px',
                        },
                    }}
                />
            )}
        </>
    );
};

export default UpdateGroupChatModal;
