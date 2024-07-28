
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatModel = new Schema({
  chatName: {
    type: String,
    required: true,
  },
  isGroupChat: {
    type: Boolean,
    required: true,
    default: false,
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  groupAdmin: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  messages: {
    type: [{
      content: {
        type: String,
        required: true,
      },
      sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    default: [], 
  },
}, {
  timestamps: true,
});

const Chat = mongoose.model("Chat", chatModel)

module.exports = Chat

