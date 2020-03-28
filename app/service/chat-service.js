const Chat = require('../models/chat-model');
const User = require('../models/user-model');


var ObjectID = require('mongodb').ObjectID;
// exports.getConversations = function (req, res, next) {
//     // Only return one message from each conversation to display as snippet

//     Conversation.find({ participants: req.user._id })
//       .select('_id')
//       .exec((err, conversations) => {
//         if (err) {
//           res.send({ error: err });
//           return next(err);
//         }

//         // Set up empty array to hold conversations + most recent message
//         const fullConversations = [];
//         conversations.forEach((conversation) => {
//           Message.find({ conversationId: conversation._id })
//             .sort('-createdAt')
//             .limit(1)
//             .populate({
//               path: 'author',
//               select: 'profile.firstName profile.lastName'
//             })
//             .exec((err, message) => {
//               if (err) {
//                 res.send({ error: err });
//                 return next(err);
//               }
//               fullConversations.push(message);
//               if (fullConversations.length === conversations.length) {
//                 return res.status(200).json({ conversations: fullConversations });
//               }
//             });
//         });
//       });
//   };

exports.getConversation = async (req, res) => {

  return new Promise((resolve, reject) => {

    Chat.find({ _id: req.body.chatId })
      .sort('-createdAt')
      .populate(
        'participants.id'
        // select: 'profile.firstName profile.lastName'
      )
      .exec((err, messages) => {
        if (err) {
          reject(err)
        } else {
          if (messages) {
            resolve({ status: 200, message: 'Chat found successfully', success: true, data: messages })
          } else {

            resolve({ status: 200, message: 'Chat not found', success: false })
          }
        }
      });
  })
};

exports.getConversations = async (req, res) => {


  return new Promise((resolve, reject) => {

    User.find({'_id' : { $nin: ObjectID(req.user._id) } }).then(data => {
      resolve({ status: 200, message: 'Chat found successfully', success: true, data: data })
    }).catch(err => {
      reject(err)
    })
  });

}

exports.newConversation = async (req, res) => {
  return new Promise((resolve, reject) => {

    if (!req.params.recipient) {
      res.status(422).send({ error: 'Please choose a valid recipient for your message.' });
      return next();
    }

    if (!req.body.composedMessage) {
      res.status(422).send({ error: 'Please enter a message.' });
      return next();
    }

    const chat = new Chat({
      participants: [req.user._id, req.params.recipient],
      messages: [{
        user: req.user._id,
        message: req.body.composedMessage
      }]
    });
    chat.save((err, newChat) => {
      if (err) {
        reject(err)
      } else {
        if (newChat) {
          resolve({ status: 200, message: 'Chat saved successfully', success: true, data: newChat })
        } else {

          resolve({ status: 200, message: 'Chat not saved', success: false })
        }
      }
    })
  })

};

exports.sendReply = async (req, res) => {
  return new Promise((resolve, reject) => {

    Chat.update({ _id: req.params.chatId },
      { $push: { messages: { user: req.user._id, message: req.body.composedMessage } } }, (err, res) => {
        if (err) {
          reject(err)
        } else {
          if (res) {
            resolve({ status: 200, message: 'Chat updated and sent succesfully', success: true, data: res })
          } else {

            resolve({ status: 200, message: 'Error while updating chat', success: false })
          }
        }
      });
  });
}


exports.getUnreadChat = async (req, res) => {
  return new Promise((resolve, reject) => {
    Chat.aggregate([
      {
        $match:{
          'participants': {
            $elemMatch:
             { 'id': ObjectID( req.user._id)}
            },
            'messages':{
              $elemMatch:{
                view:false
              }
          }
        }
      },
   
      {
        $sort:{'updated_at':-1,'messages.sendAt':-1}
      },
      {
        $unwind: '$participants'
      },
      {
        $match: {
          'participants.id': { $ne:  ObjectID( req.user._id)}
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "participants.id",
          foreignField: "_id",
          as: "participants_list"
        }
      },
      {
        $project:
         {
            _id:1,
            message: { $arrayElemAt: [ "$messages", -1 ] },
            user_details:{ $arrayElemAt: [ "$participants_list", -1 ] },
            participants:1

         }
      },
      {
        $match:{
          'message.user':{$ne:req.user._id}
        }
      },
     

    ]).then(data => {
      
      resolve(data)
    }).catch(err => {
      reject(err)
    })
  })
}

exports.getRecentChat = async (req, res) => {
  return new Promise((resolve, reject) => {
    User.find().then(data => {    
      resolve(data)
    }).catch(err => {
      console.error('error',err);
      throw err;
      reject(err)
    })
  })
}

exports.getUnreadMsgCount = async (req, res) => {
  return new Promise((resolve, reject) => {
    Chat.aggregate([
      {
        $match:{
          'participants': {
            $elemMatch:
             { 'id': ObjectID( req.user._id)}
            },
            'messages':{
              $elemMatch:{
                view:false,
                user:{$ne : ObjectID( req.user._id)}
              }
          }
        }
      },
   
      {
        $sort:{'updated_at':-1,'messages.sendAt':-1}
      },
      {
        $group: {
            _id: null,
            // get a count of every result that matches until now
            count: { $sum: 1 },
            // keep our results for the next operation
            // results: { $push: '$$ROOT' }
        }
    },
    // and finally trim the results to within the range given by start/endRow
    {
        $project: {
            count: 1,
           
        }
    }

    ]).then(data => {
      resolve(data)
    }).catch(err => {
      reject(err)
    })
  })
}