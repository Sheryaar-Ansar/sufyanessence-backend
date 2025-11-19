
const mongoose = require('mongoose')
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');


// const round2 = num => Math.round((num + Number.EPSILON) * 100) / 100;

const createOrder = async (req, res) => {
  try {
    const user = req.user || null;
    const cartId = req.cookies?.cartId || null;
    const { shippingAddress } = req.body;

    if (!shippingAddress)
      return res.status(400).json({ message: "Shipping address is required" });

    if (!cartId && !user)
      return res.status(400).json({ message: "No cart found" });

    // Load cart + product data
    const cart = await Cart.findOne({ cartId }).populate("items.product");

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Your cart is empty" });

    // Convert cart items → order items
    // console.log('Cart items: ', cart.items);

    const orderItems = cart.items.map(i => ({
      product: i.product._id,
      name: i.product.title,
      price: i.product.price,
      quantity: i.quantity
    }));

    // Pricing calculations
    const itemsPrice = round2(
      orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    );
    const shippingPrice = itemsPrice >= 100 ? 0 : 10;
    const taxPrice = 0;
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

    // 1. Create Order (without session)
    const newOrder = await Order.create({
      user: user ? user.id : null,
      cartId,
      orderItems,
      shippingAddress,
      paymentMethod: "cod",
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      isPaid: false,
      status: "pending"
    });

    // 2. Deduct product stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product)
        return res.status(400).json({ message: "Product not found" });

      if (product.stock < item.quantity)
        return res.status(400).json({
          message: `Not enough stock for ${product.title}`
        });

      product.stock -= item.quantity;
      await product.save();
    }

    // 3. Clear cart
    await Cart.deleteOne({ cartId });
    res.clearCookie("cartId");

    // Success response
    res.status(201).json({
      message: "Order placed successfully (Cash on Delivery)",
      order: newOrder
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Helper
const round2 = num => Math.round(num * 100) / 100;


const getAllOrders = async (req, res) => {
  try {
    // Optional: check if user is admin
    // if (!req.user?.isAdmin) return res.status(403).json({ message: "Access denied" });

    const orders = await Order.find()
      .populate("user", "name email") // Populate user name & email
      .populate("orderItems.product", "title price") // Populate product title & price
      .sort({ createdAt: -1 }); // Most recent orders first

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({
      message: "All orders fetched successfully",
      orders
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("orderItems.product");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ order });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const { status, isPaid, paidAt } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;

    if (status) {
      order.status = status;

      if (status === "delivered") {
        order.isDelivered = true;
        order.deliveredAt = new Date();
      }
    }

    if (isPaid) {
      order.isPaid = true;
      order.paidAt = paidAt || new Date();
    }

    await order.save();

    res.status(200).json({ message: "Order status updated", order });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createOrder, getOrderById, updateOrderStatus, getAllOrders }
