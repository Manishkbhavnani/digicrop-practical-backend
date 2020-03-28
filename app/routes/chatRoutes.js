var express = require('express');
var router = express.Router();
const ChatController = require('../controllers/chat-controller');
const auth = require('../middleware/auth');
const trimRequest = require('trim-request')


// View messages to and from authenticated user
router.post('/', trimRequest.all , auth, ChatController.getConversations);

// Retrieve single conversation
router.post('/getConversation', trimRequest.all , auth, ChatController.getConversation);

// Send reply in conversation
router.post('/sendReply/:chatId', trimRequest.all , auth, ChatController.sendReply);

// Start new conversation
router.post('/new/:recipient', trimRequest.all , auth, ChatController.newConversation);

router.post('/unreadChat',trimRequest.all,auth,ChatController.getUnreadChat);

router.post('/recentChat',trimRequest.all,auth,ChatController.getRecentChat);

router.post('/unreadMsgCount',trimRequest.all,auth,ChatController.getUnreadMsgCount);

module.exports = router;