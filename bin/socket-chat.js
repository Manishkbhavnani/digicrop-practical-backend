const Chat = require('../app/models/chat-model');
var ObjectID = require('mongodb').ObjectID;
module.exports = function(io) {

    io.sockets.on('connection', (socket) => {
      socket.on('join', (data) => {
          const chat = new Chat({
            participants: [{id:data.recepient},{ id:data.user}],
          });
          Chat.aggregate([
            {
                $match:{
                  $and:[{'participants.id': new ObjectID(data.user) },{'participants.id': new ObjectID(data.recepient) }],
                }
                
              },
          ]).then(dataUser=>{
              if(dataUser.length > 0){
                 socket.join(dataUser[0]._id);
              }else{
                chat.save((err,newChat)=>{
                  if (err) {
                    console.error('error',err);
                    throw err;
                  } else {
                    if (newChat) {
                       socket.join(newChat._id);
                       io.emit('new joinee', {chat:newChat._id});
                    } 
                }
                })
              }
          })
         
          })
     
      socket.on('message', (data,callback) => {
          Chat.findOneAndUpdate({_id: data.chatId }, 
            { $push: { messages: { user: data.user, message:data.message,sendAt:data.sendAt,view:false} } },{sort:{'sendAt':1},returnOriginal: false} ,(err, res) => {
              if (err) {
                console.error(err);
                return false;
                
              } else {
                let messageArr = []
                let messageObj = {}
                if(res && res['messages'] && res['messages'].length ) {
                  messageArr = res['messages'];
                  messageObj = messageArr[messageArr.length-1];
                }
                
                 io.emit('new message', {user: messageObj.user, message: messageObj.message ,view:messageObj.view, sendAt:messageObj.sendAt,chatId:data.chatId,_id:messageObj._id});
              }
          });

      });
      socket.on('typing', (data) => {
            io.emit('typing', {data: data, isTyping: true});
      });
      socket.on('view_message',(data)=>{
        io.emit('message_viewed',data);
        Chat.updateMany({'messages._id':{$in:data.ids}},{$set:{'messages.$[].view':true}},{multi:true} ,(err, res) => {
          if (err) {
            console.error(err);
            return false;
            
          }       });
      })
      
  });



}