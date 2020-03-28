module.exports = {
    mongoDbUrl: 'mongodb://digicrop-practical:Digicrop123@ds121896.mlab.com:21896/digicrop',
    
    globalVariables: (req, res, next) => {
        // res.locals.success_message = req.flash('success-message');
        // res.locals.error_message = req.flash('error-message');
        res.locals.user = req.user || null;
        next();
    },
    WEB_ORIGIN_LOCAL : 'http://localhost:8889',
    WEB_ORIGIN_LOCALHOST : 'http://localhost:8889',
    ENVIRONMENT :  'development'
};