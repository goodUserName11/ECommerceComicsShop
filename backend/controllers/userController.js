const UserModel = require('../models/userModel');

class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await UserModel.find();
            return res.json(users);
        } catch(e) {
            console.log(e);
            return res.status(5000).json({ message: 'Connot get users' });
        }
    }

    
}

module.exports = new UserController()