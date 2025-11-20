const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    bio: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    format: {
        type: String,
        enum: ['50ml', '100ml', '5ml', '30ml', '10ml'],
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    discountedPrice: {
        type: Number,
        required: true,
    },
    images: [{
        type: String,
        required: true,
    }],
    hover: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    subcategory: {
        type: String,
        default: ''
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    }],
    stock: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true })

ProductSchema.index({ title: 'text', description: 'text' });
module.exports = mongoose.model('Product', ProductSchema)