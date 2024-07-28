
const Chat = require('../Models/chatModel');

const fetchMessages = async (req, res) => {
    const chatId = req.params.chatId;

    try {
        const chat = await Chat.findById(chatId)
            .populate('users', '-password')
            .populate('messages.sender', 'name pic email');

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        res.status(200).json(chat.messages); 
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
    }
};


const accessChat = async (req, res) => {
    const { userId } = req.body;

    try {
        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }


        let chat = await Chat.findOne({
            isGroupChat: false,
            users: { $all: [req.user._id, userId] }
        }).populate('users', '-password')
        .populate('messages.sender', 'name pic email');

        if (!chat) {
            // Create a new chat if it doesn't exist
            const newChat = new Chat({
                chatName: 'Private Chat',
                isGroupChat: false,
                users: [req.user._id, userId],
                messages: []
            });

            await newChat.save();

            chat = await Chat.findById(newChat._id)
                .populate('users', '-password')
                .populate('messages.sender', 'name pic email');
        }

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Failed to access chat', error: error.message });
    }
};



const fetchChats = async (req, res) => {
    try {
        const chats = await Chat.find({ users: req.user._id })
            .populate('users', '-password')
            .populate('messages.sender', 'name pic email')
            .populate("groupAdmin", "-password")
            .sort({ updatedAt: -1 });

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch chats', error: error.message });
    }
};

const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all required fields" });
    }

    let users;
    try {
        users = JSON.parse(req.body.users);
    } catch (error) {
        return res.status(400).json({ message: "Invalid user data format" });
    }

    if (users.length < 2) {
        return res.status(400).json({ message: "More than 2 users are required for a group chat" });
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            messages: [],
            isGroupChat: true,
            groupAdmin: req.user
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        throw new Error(error.message);
    }
};

const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;

    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { chatName },
            { new: true }
        ).populate('users', '-password')
        .populate("groupAdmin", "-password");


        if (!updatedChat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        res.status(200).json(updatedChat);
    } catch (error) {
        res.status(500).json({ message: 'Failed to rename group', error: error.message });
    }
};

const addToGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { $addToSet: { users: userId } },
            { new: true }
        ).populate('users', '-password')
        .populate("groupAdmin", "-password")

        if (!updatedChat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        res.status(200).json(updatedChat);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add user to group', error: error.message });
    }
};

const removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { $pull: { users: userId } },
            { new: true }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password")


        if (!updatedChat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        res.status(200).json(updatedChat);
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove user from group', error: error.message });
    }
};

const sendMessage = async (req, res) => {
    const { chatId, content } = req.body;

    try {
        const newMessage = {
            content,
            sender: req.user._id,
            createdAt: new Date(),
        };

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { $push: { messages: newMessage } },
            { new: true }
        ).populate('users', '-password')
        .populate('messages.sender', 'name pic email')
        .populate("groupAdmin", "-password")

        if (!updatedChat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        res.status(201).json(updatedChat);
    } catch (error) {
        res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
};

module.exports = {
    fetchMessages,
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
    sendMessage,
};
