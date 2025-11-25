// const Review = require('../models/reviewModel');
const Reviews = require('../models/Reviews')
const Review = require('../models/Reviews')

// Assuming your route will be like: POST /api/products/:id/review
const createReview = async (req, res) => {
    try {
        const { username, email, comment, rating } = req.body;
        const productId = req.params.id;

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({ product: productId, email });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        // Use Cloudinary URLs instead of local file paths
        const Canimages = req.files?.length
            ? req.files.map(file => file.path)  // <-- CLOUDINARY URL HERE
            : [];

        // Create new review
        const newReview = await Review.create({
            product: productId,
            username,
            email,
            comment,
            rating,
            images: Canimages,  // <-- stored as Cloudinary URLs
            isApprove: false,
        });

        res.status(201).json({
            message: 'Review created successfully',
            review: newReview,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



const getAllReviews = async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query
        const skip = (parseInt(page - 1) * parseInt(limit))
        const pendingReviews = await Reviews.find({ isApprove: false }).skip(skip).sort('-createdAt').limit(limit).populate('product', 'title images')
        if (!pendingReviews) {
            return res.status(404).json({ error: "No Reviews Found" })
        }
        res.json(pendingReviews)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const getAllAcceptedReviews = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query
        const skip = (parseInt(page - 1) * parseInt(limit))
        const allReviews = await Reviews.countDocuments({ isApprove: true })
        const pendingReviews = await Reviews.find({ isApprove: true }).skip(skip).sort('-createdAt').limit(limit).populate('product', 'title images')
        if (!pendingReviews) {
            return res.status(404).json({ error: "No Reviews Found" })
        }
        res.json({allReviews, pendingReviews})

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params
        const reviews = await Review.find({ product: productId, isApprove: true }).sort({ createdAt: -1 })
        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this product' })
        }
        res.status(200).json({ reviews })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params
        const review = await Review.findByIdAndDelete(id)
        if (!review) {
            return res.status(404).json({ message: 'Review not found' })
        }
        res.status(200).json({ message: 'Review deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const approveReview = async (req, res) => {
    try {
        const { id } = req.params

        const review = await Review.findById(id)
        if (!review) {
            return res.status(404).json({ message: 'Review not found' })
        }

        review.isApprove = true
        await review.save()

        res.status(200).json({ message: 'Review approved successfully', review })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

module.exports = { createReview, getReviewsByProduct, approveReview, deleteReview, getAllReviews, getAllAcceptedReviews }