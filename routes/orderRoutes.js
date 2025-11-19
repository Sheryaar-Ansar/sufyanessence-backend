const express = require('express')
const router = express.Router()
const { createOrder, updateOrderStatus, getOrderById, getAllOrders } = require('../controllers/orderController')
const { authenticate } = require('../middlewares/auth')
const authRole = require('../middlewares/authRole')

router.post('/orders', createOrder)
router.get('/orders', authenticate, authRole('admin'), getAllOrders)
router.get('/orders/:id', authenticate, authRole('admin'), getOrderById)
router.put('/orders/:id/status', authenticate, authRole('admin'), updateOrderStatus)

module.exports = router