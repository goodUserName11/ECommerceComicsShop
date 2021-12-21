const Router = require('express');
const router = new Router();

const BasketController = require("../controllers/basketController");

router.get("/getUserBasket", BasketController.getUserBasket);
router.post("/createBasket", BasketController.createBasket);
router.post("/updateBasket", BasketController.updateBasket);
router.post("/addBasket", BasketController.addBasket);
router.post("/deleteBasket", BasketController.deleteBasket);
router.post("/deleteElBasket", BasketController.deleteElBasket);


module.exports = router;