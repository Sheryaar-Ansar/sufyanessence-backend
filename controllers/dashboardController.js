const Order = require("../models/Order");
const Product = require("../models/Product");
const Reviews = require('../models/Reviews')

const getStats = async (req,res) => {
    try {
        const products = await Product.countDocuments()
        const reviews = await Reviews.countDocuments()
        const orders = await Order.countDocuments()
        const pendingOrders = await Order.countDocuments({status: 'pending'})
        const processingOrders = await Order.countDocuments({ status: 'processing' })
        const completedOrders = await Order.countDocuments({ status: 'delivered' })
        const pendingReviews = await Reviews.countDocuments({ isApprove: false })

        res.json({ products, reviews, orders, pendingOrders, processingOrders, completedOrders, pendingReviews })
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

module.exports = {getStats}