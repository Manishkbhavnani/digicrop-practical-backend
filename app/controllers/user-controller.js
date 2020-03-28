const userService = require('../service/user-service');

/**
 * @author : Manish Bhavnani
 */
exports.userAdd = async (req, res) => {
    try {

        var users = await userService.createUserNew(req.body);
        return res.status(users.status).json(users);
    } catch (e) {
        return res.status(e.status).json(e);
    }
}

exports.identifyMe = async (req, res) => {
    try {
        var auth = await userService.authMe(req.user, req.body);
        return res.status(200).json(auth);
    } catch (e) {
        return res.status(500).json({ status: 500, message: e.message });
    }
}

exports.auth = async (req, res) => {
    try {
        var auth = await userService.authUser(req.body);
        if (auth.usrData) {
            res.cookie('_dtl', JSON.stringify(auth.usrData));
        }
        return res.status(200).json(auth);
    } catch (e) {
        return res.status(500).json({ status: 500, message: e.message });
    }
}



exports.logoutUser = async (req, res) => {
    try {
        var logout = await userService.logoutUser(req.user);
        return res.status(200).json(logout);
    } catch (e) {
        console.error(e);
        return res.status(500).json(e);
    }
}


