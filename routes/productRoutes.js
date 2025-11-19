const express = require('express')
const router = express.Router()
const { createProduct, getAllProducts, getProductById, deleteProduct, updateProduct } = require('../controllers/productController')
const authRole = require('../middlewares/authRole')
// const authenticate = require('../middlewares/auth')
const { authenticate } = require('../middlewares/auth')
const upload = require('../middlewares/upload');

router.post('/products', authenticate, authRole('admin'), createProduct)
router.get('/products', getAllProducts)
// Single hover image

router.post('/upload/hover', upload.single('hover'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({ url: `/uploads/${req.file.filename}` });
});

// Multiple images
router.post('/upload/images', upload.array('images', 10), (req, res) => {
  const urls = req.files.map(file => `/uploads/${file.filename}`);
  res.json({ urls });
});
router.get('/products/:id', getProductById)
router.put('/products/:id', authenticate, authRole('admin'), updateProduct)
router.delete('/products/:id', authenticate, authRole('admin'), deleteProduct)

module.exports = router