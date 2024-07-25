import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('userInfo');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            if (Date.now() > parsedUser.expirationTime) {
                localStorage.removeItem('userInfo');
                return null;
            }
            return parsedUser;
        }
        return null;
    });
    const [selectedChat, setSelectedChat] = useState('');
    const [chats, setChats] = useState();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('userInfo'));
        if (savedUser && Date.now() > savedUser.expirationTime) {
            localStorage.removeItem('userInfo');
            setUser(null); 
        }
    }, []);

    useEffect(() => {
        if (!user && location.pathname !== '/register' && location.pathname !== '/') {
            navigate('/');
        } else if (user && (location.pathname === '/' || location.pathname === '/register')) {
            navigate('/chats');
        }
    }, [user, navigate, location.pathname]);

    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;
