const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  customerName: String,
  customerEmail: {
    type: String,
    required: false,
  },

  status: {
    type: String,
    enum: ["Pending", "Cancelled", "Completed"],
    default: "Pending",
    required: true,
  },
  total_amount: { type: Number, required: true },
  order_items: [orderItemSchema],
});

module.exports = mongoose.model("Order", orderSchema);
