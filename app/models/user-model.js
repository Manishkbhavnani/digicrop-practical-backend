var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
var moment = require('moment');
var validateEmail = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
};

const UserSchema = new Schema({

    firstName: {
        type: String,
        required: false
    },

    lastName: {
        type: String,
        required: false
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please fill a valid email address']
    },

    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    token: {
        type: String
    },
    gender:{type:String},
    
}, {
    collection: 'users',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

//custom method to generate authToken 
UserSchema.methods.generateAuthToken = function(id,role) {
    const user = this;
    const payload = { _id: id };
    const issuerURL = process.env.ENVIRONMENT === 'live' ? process.env.WEB_ORIGIN_DEV : process.env.WEB_ORIGIN_LOCAL
    const options = { expiresIn: '1d', issuer: issuerURL };
    const token = jwt.sign(payload, process.env.JWT_SALT, options); //get the private key from the config file -> environment variable
    user.token = token;
    user.save();
    return token;
}

module.exports = mongoose.model('users', UserSchema);