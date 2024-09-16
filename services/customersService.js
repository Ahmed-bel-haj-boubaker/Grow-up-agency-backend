const expressAsyncHandler = require("express-async-handler");
const Customers = require("../models/customers");

exports.getCustomers = expressAsyncHandler(async (req, res) => {
  const customers = await Customers.find();
  return res.status(200).json({ data: customers });
});
