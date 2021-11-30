const Router = require('express');
const router = new Router();

const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
// router.get('/getById', groupController.getGroupById);
// router.post('/create', (req, res)=> {groupController.createGroup(req, res) });
// router.post('/update', groupController.updateGroup);
// router.post('/delete', groupController.deleteGroup);

module.exports = router