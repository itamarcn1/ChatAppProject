import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ChatState } from '../../contextApi/ChatProvider.jsx'
import { MyChats } from '../MyChats/MyChats.jsx'
import { ChatBox } from '../ChatBox/ChatBox.jsx'
import { Box } from '@mui/material'
import { TopBar } from '../TopBar/TopBar.jsx'
import './chatPage.css'


export const ChatPage = () => {
    const { user } = ChatState()
    const [fetchAgain, setFetchAgain] = useState(false)

    return (
        <div className="chat-page-container">
            {user && <TopBar />}
            <Box className="chat-page-box">
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    )
}