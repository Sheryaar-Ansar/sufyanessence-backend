// const { Product } = require('../models/productModel');

const Product = require("../models/Product")




const createProduct = async (req, res) => {
    try {
        const { title } = req.body
        const product = await Product.findOne({ title })
        if (product) {
            return res.status(400).json({ message: 'Product with this name already exists' })
        }
        const newProduct = await Product.create({ ...req.body })
        res.status(201).json({ message: 'Product created successfully', product: newProduct })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, subcategory, minPrice, maxPrice, search } = req.query;
        let filter = {}
        if (subcategory) {
            filter.subcategory = subcategory
        }
        if (minPrice || maxPrice) {
            filter.price = {}
            if (minPrice) filter.price.$gte = Number(minPrice)
            if (maxPrice) filter.price.$lte = Number(maxPrice)
        }
        if (search) {
            filter.name = { $regex: search, $options: 'i' }
        }
        const TotalProducts = await Product.countDocuments(filter)
        const products = await Product.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 })
            .populate('category', 'title name')

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found' })
        }
        // const limitedProductsInfo = products.map(({ _id, title, price, category, createdAt, reviews, discountedPrice, images, hover, bio }) => ({
        //     _id, title, price, bio, category, createdAt, reviews, discountedPrice, images, hover, bio
        // }))
        res.status(200).json({
            TotalProducts,
            page: Number(page),
            totalPages: Math.ceil(TotalProducts / limit),
            limit: Number(limit),
            products: products
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}



const getProductById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        res.status(200).json({ product })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update basic fields
        const { title, price, discountedPrice, bio, description, format, category, subcategory } = req.body;
        product.title = title;
        product.price = price;
        product.discountedPrice = discountedPrice;
        product.bio = bio;
        product.description = description;
        product.format = format;
        product.category = category;
        product.subcategory = subcategory;

        // Update images if uploaded
        if (req.files && req.files.length > 0) {
            product.images = req.files.map(f => f.filename);
        }

        // Update hover image if uploaded (assuming single file)
        if (req.filesHover && req.filesHover.length > 0) {
            product.hover = req.filesHover[0].filename;
        }

        await product.save();

        res.status(200).json({ message: 'Product updated successfully', product });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const deletedProduct = await Product.findByIdAndDelete(id)
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' })
        }
        res.status(200).json({ message: 'Product deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct }