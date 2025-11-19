const express = require('express')
const router = express.Router()

const { createReview, getReviewsByProduct, deleteReview, approveReview, getAllReviews, getAllAcceptedReviews } = require('../controllers/reviewController')
const { authenticate } = require('../middlewares/auth')
const authRole = require('../middlewares/authRole')
const upload = require('../middlewares/upload')

router.get('/reviews/pending', authenticate, authRole('admin'), getAllReviews)
router.get('/reviews', getAllAcceptedReviews)
// Multiple images
// router.post('/upload/reviews-images', upload.array('images', 10), (req, res) => {
//   const urls = req.files.map(file => `/uploads/${file.filename}`);
//   res.json({ urls });
// });
router.post('/reviews/:id', upload.array("images", 10), createReview)
router.get('/reviews/:productId', getReviewsByProduct)
router.put('/reviews/:id/approve', authenticate, authRole('admin'), approveReview)
router.delete('/reviews/:id', authenticate, authRole('admin'), deleteReview)

module.exports = router