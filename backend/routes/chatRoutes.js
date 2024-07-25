

const express = require('express');
const { checkToken } = require('../middlewares/authMiddleware');
const {
  accessChat,
  removeFromGroup,
  addToGroup,
  fetchChats,
  createGroupChat,
  renameGroup,
  fetchMessages,
  sendMessage, 
} = require('../controllers/chatControllers');
const router = express.Router();

router.route('/').post(checkToken, accessChat).get(checkToken, fetchChats);
router.route('/group').post(checkToken, createGroupChat);
router.route('/rename-group').put(checkToken, renameGroup);
router.route('/add-to-group').put(checkToken, addToGroup);
router.route('/group-remove').put(checkToken, removeFromGroup);
router.route('/:chatId/messages').get(checkToken, fetchMessages);
router.route('/message').post(checkToken, sendMessage);

module.exports = router;
