const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  quote: { type: mongoose.Schema.Types.ObjectId, ref: "Quote", required: true },

  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
