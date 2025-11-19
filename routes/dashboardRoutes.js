const express = require('express')
const router = express.Router()
const { getStats } = require('../controllers/dashboardController')
const { authenticate } = require('../middlewares/auth')
const authRole = require('../middlewares/authRole')

router.get('/dashboard/stats', authenticate, authRole('admin'), getStats)

module.exports = router