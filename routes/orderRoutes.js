const express = require('express')
const router = express.Router()
const { createOrder, updateOrderStatus, getOrderById, getAllOrders } = require('../controllers/orderController')
const { authenticate } = require('../middlewares/auth')
const authRole = require('../middlewares/authRole')

router.post('/orders', createOrder)
router.get('/orders', authenticate, authRole('admin'), getAllOrders)
// router.get('/orders/processing', authenticate, authRole('admin'), getProcessingOrders)
// router.get('/orders/delivered', authenticate, authRole('admin'), getDeliveredOrders)
// router.get('/orders/cancelled', authenticate, authRole('admin'), getCancelledOrders)
router.get('/orders/:id', authenticate, authRole('admin'), getOrderById)
router.put('/orders/:id/status', authenticate, authRole('admin'), updateOrderStatus)

module.exports = router