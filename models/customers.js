const mongoose = require("mongoose");

const customersSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phoneNumber: Number,
  adresse: String,
});

const Customers = mongoose.model("Customers", customersSchema);

module.exports = Customers;
