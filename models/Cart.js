const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: Number
        }
    ]
}, { timestamps: true });

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart
