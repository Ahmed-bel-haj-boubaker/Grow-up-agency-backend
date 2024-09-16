const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String },
    contact_info: {
      phone: String,
      email: String,
      address: String,
    },
    order_history: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Ensure this is an ObjectId or use a different identifier

        date: Date,
        total_amount: Number,
      },
    ],
  },
  { timestamps: true }
);
const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier;
