const express = require('express')
const router = express.Router()
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categoryController')
const { authenticate } = require('../middlewares/auth')
const authRole = require('../middlewares/authRole')

router.post('/categories', authenticate, authRole('admin'), createCategory)
router.get('/categories', getAllCategories)
router.get('/categories/:id', getCategoryById)
router.put('/categories/:id', authenticate, authRole('admin'), updateCategory)
router.delete('/categories/:id', authenticate, authRole('admin'), deleteCategory)

module.exports = router