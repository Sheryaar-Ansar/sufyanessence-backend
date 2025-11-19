const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true
    },
    images: [{
        type: String,
    }],
    isApprove: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

module.exports = mongoose.model('Review', ReviewSchema)