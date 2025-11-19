const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Route to add an item to the cart
router.post('/cart/add', cartController.addToCart);

// Route to get the current cart
router.get('/cart', cartController.getCart);

module.exports = router;
