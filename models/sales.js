const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  customerName: { type: String, required: false },
  customerEmail: {
    type: String,
    required: false,
  },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["delivery", "local"],
    default: "local",
  },
});

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;
