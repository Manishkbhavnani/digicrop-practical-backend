// Module Imports
const express = require('express')
const router = express.Router();
const passport = require('passport');
const user = require('../models/user-model');
var cookieParser = require('cookie-parser');
const config = require('../../bin/configuration')

/*
 * Setup routes for index
 */

router.get('/', (req, res) => {
  res.render('index')
})




// Router Configuration
router.use('/user', require('./user-routes'));
router.use('/chat', require('./chatRoutes'));

/*
 * Handle 404 error
 */
router.use('*', (req, res) => {
  res.status(404).json({
    errors: {
      msg: 'URL_NOT_FOUND'
    }
  })
})

module.exports = router
