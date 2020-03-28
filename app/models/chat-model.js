const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
 participants: [{
        id : { type: Schema.Types.ObjectId,ref: 'users'},
        role : { type: Number, required: true , default :1 }  
        
    }],
    messages:[{
        user:{type: Schema.Types.ObjectId, ref: 'users'},
        message:{   type: String,required: false},
        view:{type:Boolean},
        sendAt :{ type : Number, default: Date.now }
    }]
   }, {
    collection: 'chats',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('chats', chatSchema);