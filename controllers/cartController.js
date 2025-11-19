const { v4: uuidv4 } = require("uuid");
const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");
const mongoose = require('mongoose')

const addToCart = async (req, res) => {
    try {

        let cartId = req.cookies.cartId; // Read guest cart cookie
        const { items } = req.body;  // Array of items (productId, quantity)

        for (let item of items) {
            const productId = item.product;  // This is a string, must be converted to ObjectId
            // console.log("productId: ", productId);

            const quantity = item.quantity;

            // Convert productId to ObjectId
            const productObjectId = new mongoose.Types.ObjectId(productId);  // Convert string to ObjectIdt
            // console.log("productObj: ", productObjectId);


            // Check if product exists in the database
            const productExists = await Product.findById(productObjectId);
            // console.log("ProductExists: ", productExists);

            if (!productExists) {
                return res.status(400).json({ message: `Product with ID ${productId} not found` });
            }

            // Check if cart exists or create a new one
            if (!cartId) {

                cartId = new mongoose.Types.ObjectId();
                res.cookie("cartId", cartId.toString(), {
                    httpOnly: true,
                    secure: true,
                    maxAge: 30 * 24 * 60 * 60 * 1000
                });

                await Cart.create({
                    cartId,
                    items: [{ product: productObjectId, quantity }]
                });

                return res.status(201).json({ message: "Item added to cart" });
            }

            let cart = await Cart.findOne({ cartId });

            if (!cart) {
                cart = await Cart.create({
                    cartId,
                    items: [{ product: productObjectId, quantity }]
                });
                return res.status(201).json({ message: "Item added to cart" });
            }

            // Check if product exists in cart
            console.log("cart: ", cart.items, "productId: ", productObjectId);
            const existingItem = cart.items.find(
                (item) => item.product.toString() === productObjectId.toString()
            );


            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product: productObjectId, quantity });
            }

            await cart.save();

            res.status(200).json({ message: "Cart updated", cart });
        }

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const getCart = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;

        if (!cartId) {
            return res.status(200).json({ items: [] });
        }

        const cart = await Cart.findOne({ cartId }).populate('items.product').exec();
        console.log(cart)
        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            console.log('Product:', product);
        }

        res.status(200).json({ cart });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
module.exports = { addToCart, getCart }