const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false // guest checkout allowed
  },

  cartId: { type: String, required: false }, // for guests

  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: String,
      price: Number,
      quantity: Number,
    }
  ],

  shippingAddress: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
  },

  paymentMethod: {
    type: String,
    default: "cod",          // Always COD
    enum: ["cod"]
  },

  itemsPrice: Number,
  shippingPrice: Number,
  taxPrice: Number,
  totalPrice: Number,

  isPaid: { type: Boolean, default: false }, // COD is unpaid on checkout
  paidAt: { type: Date },

  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date }

}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order