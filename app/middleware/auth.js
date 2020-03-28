const jwt = require('jsonwebtoken')
const User = require('../models/user-model');
const { JWT_SALT } = require('../../bin/configuration');

const auth = async(req, res, next) => {
    const authorizationHeaader = req.headers.token;
    try {
        const issuerURL = process.env.ENVIRONMENT === 'live' ? process.env.WEB_ORIGIN_DEV : process.env.WEB_ORIGIN_LOCAL
        if (authorizationHeaader) {
            const options = {
                expiresIn: '1d',
                issuer: issuerURL
            };

            const data = jwt.verify(authorizationHeaader, process.env.JWT_SALT, options);
            const user = await User.findOne({ _id: data._id, token: authorizationHeaader });
        
            if (!user) {
                throw new Error({ error: data });
            }
            req.user = user
            
            req.token = authorizationHeaader
            next()
        } else {
            res.status(401).send({ status: 401, error: "Access denied. No token provided." });
        }
    } catch (error) {
      
        res.status(401).send({ status: 401, error: 'Session Expired' })
    }

}
module.exports = auth