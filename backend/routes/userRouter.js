const Router = require('express');
const router = new Router();

const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/logout', userController.logoutUser);
router.post('/login', userController.loginUser);
router.post('/create', userController.createUser);
router.post('/delete', userController.deleteUser);
router.post('/updateInfo', userController.updateUserInfo);
router.post('/updatePassword', userController.updateUserPassword);
router.get('/updateAdmin', userController.updateUserAdmin);

module.exports = router