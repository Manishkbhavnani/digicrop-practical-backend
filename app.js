// Pre Build Module Imports
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const https = require('https');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const cors = require('cors')
const bodyParser = require('body-parser')
const compression = require('compression');
const morgan = require('morgan');
var fs = require('fs');
const http = require('http');
const socketChat = require('./bin/socket-chat');



require('dotenv').config();
// Middleware Imports

const { mongoDbUrl, globalVariables } = require('./bin/configuration');


var app = express();

mongoose.set("debug", true); // debugging is on  
// Configure Mongoose to Connect to MongoDB


mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useFindAndModify: false })
    .then(response => {
        console.log('Digicrop Mlab database connected')
    }).catch(err => {
    });



morgan.token('id', function getId(req) {
    return req.id
});




app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.append('Access-Control-Allow-Credentials', true);
    next();
});

app.use(compression())
app.use(cookieParser("secret_passcode"));

app.use(express.static('./app/public'));
/*  Flash and Session*/
app.use(session({
    secret: 'secret_passcode',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 4000000
    }
}));


app.use(flash());


app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});



/* Use Global Variables */
app.use(globalVariables);


/* Method Override Middleware*/
app.use(methodOverride('newMethod'));




app.use(require('./app/routes'))



// orward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



var port = process.env.PORT || process.env.CPORT;
const server = app.listen(port, () => {
    console.log('server is running on port:', port);
 });

 const server1 = http.createServer(app);
 const socket_port = process.env.PORT || process.env.SOCKETPORT
 server1.listen(socket_port, () => {
    console.log('Server Socket is running on ', socket_port);
 });
 const io = require('socket.io').listen(server1);
 socketChat(io);


module.exports = app;












