const chatService = require('../service/chat-service');


exports.getConversations = async (req, res) => { 
    try {
      
        var chat = await chatService.getConversations(req);
        return res.status(200).json({ status: 200, data: chat });
    } catch(e) {
        return res.status(400).json(e);
    }
}

exports.getConversation = async (req, res) => { 
    try {
      
        var chat = await chatService.getConversation(req);
        return res.status(200).json({ status: 200, data: chat });
    } catch(e) {
        return res.status(400).json(e);
    }
}
exports.sendReply = async (req, res) => { 
    try {
      
        var chat = await chatService.sendReply(req);
        return res.status(200).json({ status: 200, data: chat });
    } catch(e) {
        return res.status(400).json(e);
    }
}
exports.newConversation = async (req, res) => { 
    try {
      
        var chat = await chatService.newConversation(req);
        return res.status(200).json({ status: 200, data: chat });
    } catch(e) {
        return res.status(400).json(e);
    }
}
exports.getUnreadChat = async (req, res) => { 
    try {
      
        var chat = await chatService.getUnreadChat(req);
        return res.status(200).json({ status: 200, data: chat });
    } catch(e) {
        return res.status(400).json(e);
    }
}

exports.getRecentChat = async (req, res) => { 
    try {
      
        var chat = await chatService.getRecentChat(req);
        return res.status(200).json({ status: 200, data: chat });
    } catch(e) {
        return res.status(400).json(e);
    }
}
exports.getUnreadMsgCount = async (req, res) => { 
    try {
      
        var chat = await chatService.getUnreadMsgCount(req);
        return res.status(200).json({ status: 200, data: chat });
    } catch(e) {
        return res.status(400).json(e);
    }
}