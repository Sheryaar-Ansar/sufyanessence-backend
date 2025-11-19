const Order = require("../models/Order");
const Product = require("../models/Product");
const Reviews = require('../models/Reviews')

const getStats = async (req,res) => {
    try {
        const products = await Product.countDocuments()
        const reviews = await Reviews.countDocuments()
        const orders = await Order.countDocuments()
        res.json({ products, reviews, orders })
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

module.exports = {getStats}