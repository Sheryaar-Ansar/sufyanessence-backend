const { v4: uuidv4 } = require("uuid");
const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");
const mongoose = require('mongoose')

const addToCart = async (req, res) => {
    try {

        let cartId = req.cookies.cartId; 
        const { items } = req.body;

        for (let item of items) {

            const productObjectId = new mongoose.Types.ObjectId(item.product);
            const quantity = item.quantity;

            // Check product exists
            const productExists = await Product.findById(productObjectId);
            if (!productExists) {
                return res.status(400).json({ message: `Product with ID ${item.product} not found` });
            }

            // Create new cart if cookie missing
            if (!cartId) {
                cartId = new mongoose.Types.ObjectId();

                res.cookie("cartId", cartId.toString(), {
                    httpOnly: true,
                    secure: true,
                    sameSite: "None",
                    domain: ".sufyanessence.com",   // REQUIRED FOR MOBILE
                    path: "/",                      // REQUIRED FOR MOBILE
                    maxAge: 30 * 24 * 60 * 60 * 1000
                });

                await Cart.create({
                    cartId,
                    items: [{ product: productObjectId, quantity }]
                });

                return res.status(201).json({ message: "Item added to cart" });
            }

            // Find existing cart
            let cart = await Cart.findOne({ cartId });

            if (!cart) {
                cart = await Cart.create({
                    cartId,
                    items: [{ product: productObjectId, quantity }]
                });

                return res.status(201).json({ message: "Item added to cart" });
            }

            // Update existing item or add new
            const existingItem = cart.items.find(
                (i) => i.product.toString() === productObjectId.toString()
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product: productObjectId, quantity });
            }

            await cart.save();

            return res.status(200).json({ message: "Cart updated", cart });
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

// @route PUT /api/cart/update-quantity
// Handles setting the absolute quantity of an item.
const updateCartQuantity = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const { items } = req.body; // Expects [{ product: productId, quantity: newQty }]

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items provided." });
        }
        
        const { product: productId, quantity: newQty } = items[0];
        
        if (newQty <= 0) {
            // Forward to remove controller if quantity is zero or less
            return removeFromCart({ 
                cookies: req.cookies, 
                body: { items: [{ product: productId }] },
                status: (s) => ({ json: (j) => res.status(s).json(j) }) // Mock response for chaining
            }, res);
        }

        const productObjectId = new mongoose.Types.ObjectId(productId);
        let cart = await Cart.findOne({ cartId });
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        const existingItem = cart.items.find(
            (item) => item.product.toString() === productObjectId.toString()
        );

        if (!existingItem) {
            return res.status(404).json({ message: "Item not found in cart." });
        }

        // Set the absolute quantity
        existingItem.quantity = newQty;

        await cart.save();
        
        const updatedCart = await Cart.findById(cart._id).populate('items.product').exec();
        res.status(200).json({ message: "Item quantity updated", cart: updatedCart });

    } catch (err) {
        console.error("updateCartQuantity error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @route DELETE /api/cart/remove
// Handles removing an item completely from the cart.
const removeFromCart = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const { items } = req.body; // Expects [{ product: productId }]

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items provided." });
        }
        
        const { product: productId } = items[0];
        const productObjectId = new mongoose.Types.ObjectId(productId);
        
        let cart = await Cart.findOne({ cartId });
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        // Filter out the item to be removed
        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productObjectId.toString()
        );

        await cart.save();
        
        const updatedCart = await Cart.findById(cart._id).populate('items.product').exec();
        res.status(200).json({ message: "Item removed from cart", cart: updatedCart });

    } catch (err) {
        console.error("removeFromCart error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
module.exports = { addToCart, getCart, updateCartQuantity, removeFromCart }