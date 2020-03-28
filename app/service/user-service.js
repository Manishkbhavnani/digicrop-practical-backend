const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const moment = require("moment");
const Joi = require("joi");
var cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @author Manish Bhavnani
 */



/**
 * @author : Manish Bhavnani]
 * @param data : request body
 */
exports.createUserNew = async data => {
  return new Promise((resolve, reject) => {
    const schema = Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
      firstName : Joi.string().required(),
      lastName : Joi.string().required()
    });

    Joi.validate(data, schema, (err, value) => {
      if (err) {
        reject({
          status: 422,
          err : err,
          message: "Invalid request data"
        });
      } else {
        User.findOne({ email: data.email }).then((user, err) => {
          if (err) {
            reject(err);
          } else if (user) {
            resolve({
              status: 200,
              message: "Email Already Exist",
              isAvailable: true,
              success: false
            });
          } else {
            const newUser = new User(data);
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                  reject(err);
                }
                newUser.password = hash;
                newUser.save().then((user, err) => {
                  const token = newUser.generateAuthToken(user._id);
                  if (err) {
                    reject(err);
                  } 
                 
                  
                  resolve({
                    status: 200,
                    message: "User Register Successfully",
                    token : token,
                    success: true
                  });
             
                });
              });
            });
          }
        });
      }
    });
  });
};


exports.authMe = async data => {
  return new Promise((resolve, reject) => {
    User.findOne({ email: data.email }, { email: 1, _id: 1, firstName: 1, lastName: 1, dob: 1, address: 1, phoneNumber: 1 }).then(
      (user, err) => {
        if (err) {
          reject(err);
        } else if (!user) {
          resolve({
            status: 200,
            message: "Email not registered.",
            success: false
          });
        }
        resolve({ status: 200, data: user, success: true });
      }
    );
  });
};




exports.authUser = async data => {
  return new Promise((resolve, reject) => {
    User.findOne({ email: data.email }).then((user, err) => {

      if (err) {
        reject(err);
      } else if (!user) {
        resolve({ status: 200, message:  'No User Found', success: false });
      } else {
        bcrypt.compare(data.password, user.password, function (err, hash) {
          if (hash) {
            let token = user.generateAuthToken(user._id);
                  const usrData = JSON.parse(JSON.stringify(user));
                  delete usrData["password"];
                  delete usrData["created_at"];
                  delete usrData["updated_at"];
               
                  resolve({
                    status: 200,
                    message: "Login Sucessful",
                    success: true,
                    token: token,
                    data: usrData
                  });
          } else {
            resolve({
              status: 200,
              message: "Login Unsucessful",
              success: false
            });
          }
        });
      }
    });
  });
};

exports.logoutUser = async data => {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: data._id, token: data.token }).then((user, err) => {
      if (err) {
        reject({ status: 401, message: "Not Autherized", success: false });
      } else if (!user) {
        reject({ status: 401, message: "Not Autherized", success: false });
      }
      user.token = null;
      user.save();
      resolve({ status: 200, message: "Logout Successful", success: true });
    });
  });
};



