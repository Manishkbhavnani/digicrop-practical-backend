var express = require('express');
var router = express.Router();
const userController = require('../controllers/user-controller');
const auth = require('../middleware/auth');
const trimRequest = require('trim-request')





router.post('/register' , trimRequest.all, userController.userAdd);
router.post('/auth' , trimRequest.all, userController.auth);
router.post('/me' , trimRequest.all, auth, userController.identifyMe);

router.post('/logout' , trimRequest.all, auth, userController.logoutUser);
module.exports = router;