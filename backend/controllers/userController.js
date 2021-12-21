const bcrypt = require('bcryptjs');

const BasketController = require('./basketController');

const UserModel = require('../models/userModel');

//для загрузки картинок
//base 64 
//сохранять на машине
// есть решение на гите у Артема
class UserController {
    async getOneUser(userId) {
        try {
            

            // UserModel.

            const user = await UserModel.findOne({_id: userId});
            return user;
        } catch(e) {
            console.log(e);
            return { message: 'Connot get user' };
        }
    }

    async getAllUsers() {
        try {
            const users = await UserModel.find();

            return users;
        } catch(e) {
            console.log(e);
            return { message: 'Connot get users' };
        }
    }

    async loginUser(req, res) {
        try {
            
            const { email, password } = req.body;

            if (!email || !password) {
                res.redirect('/error?errorMessage=Your%20data%20is%20empty');
                return;
            }

            let user = await UserModel.findOne({ email: email });

            if (!user) {
                res.redirect('/error?errorMessage=User%20not%20found');
                return;
            }

            if (!bcrypt.compareSync(password, user.password)) {
                res.redirect('/error?errorMessage=Password%20is%20incorrect');
                return;
            }

            req.session.user_token = user._id;

            if(!user.name) {
                res.redirect("/userPage");
                return;
            }

            res.redirect("/");

            return res.redirect('/');
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Connot login user' });
        }
    }

    async logoutUser(req, res){
        try {
            req.session.user_token = null;
            res.redirect('/');
            
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Connot logout user' });
        }
    }

    async createUser(req, res) {
        try {
            const { email, password } = req.body;

            if((await UserModel.find({email: email})).length > 0){
                return res.status(406).json({ message: 'User with this email allready exists' });
            }

            const hashPassword = bcrypt.hashSync(password, 7);

            const result = await UserModel.create({email, password: hashPassword, admin: false, gender: 'not'});

            console.log(result);

            BasketController.createBasket(result._id);

            res.redirect('/login');
            return;
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Connot create user' });
        }
    }

    async deleteUser(req, res) {
        try {
            const { userId, deletionUserId } = req.body;
            
            let deletionUser = await UserModel.findOne({_id: deletionUserId});
            let user = await UserModel.findOne({_id: userId});

            console.log(deletionUser);

            if(!deletionUser){
                return res.status(404).json({ message: 'There is no such user' });
            }

            if(deletionUser.isAdmin){
                return res.status(403).json({ message: 'Cannot delete admin' });
            }

            if(!user.isAdmin){
                return res.status(403).json({ message: 'Only for admin' });
            }

            const result = await UserModel.deleteOne({_id: deletionUserId});
            return res.json(result);
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Connot delet user' });
        }
    }

    async updateUserInfo(req, res) {
        try {
            const userId = req.session.user_token;
            const { name, surname, patronymic, gender, email, phone } = req.body;
            
            let result;

            if(!userId || !name || !surname || !gender || !email || !phone){
                return res.status(406).json({ message: 'There are not all required fields' });
            }

            if(!patronymic){
                result = await UserModel.updateOne({_id: userId}, {$set: {name, surname, gender, email, phone}});
            }
            else {
                result = await UserModel.updateOne({_id: userId}, {$set: {name, surname, patronymic, gender, email, phone}});
            }

            return res.redirect('/userPage');
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Connot update user info' });
        }
    }

    async updateUserPassword(req, res) {
        try {
            const { userId, newPassword } = req.body;

            const hashPassword = bcrypt.hashSync(newPassword, 7);

            const result = await UserModel.updateOne({_id: userId}, {$set: {hashPassword}});
            return res.json(result);
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Connot update user password' });
        }
    }

    async updateUserAdmin(req, res) {
        try {

            if (!req.session || !req.session.user_token){
                res.redirect('/login');
                return;
            }

            if (!(await new UserController().getOneUser(req.session.user_token)).isAdmin) {
                res.redirect('/');
            }

            const {userId} = req.query;

            let user = (await new UserController().getOneUser(userId));
            
            user.isAdmin = !user.isAdmin;

            user.save();
            return res.redirect('/adminUsers');
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Connot update user admin' });
        }
    }
}

module.exports = new UserController();