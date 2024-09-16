// models/deliveryNote.js
const mongoose = require("mongoose");

const deliveryNoteSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  deliveryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Delivered"],
    default: "Pending",
  },
  trackingNumber: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("DeliveryNote", deliveryNoteSchema);
