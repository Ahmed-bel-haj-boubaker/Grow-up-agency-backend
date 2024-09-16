const Customers = require("../models/customers");
const Sale = require("../models/sales");
const { deleteOne } = require("./handlersFactory");

exports.createSale = async (req, res) => {
  try {
    console.log(req.body);
    const {
      category,
      product,
      customerEmail,
      customerName,
      quantity,
      totalPrice,
    } = req.body;

    let customer = await Customers.findOne({ email: customerEmail });

    if (!customer) {
      customer = await Customers.create({
        fullName: customerName,
        email: customerEmail,
      });
    }

    const sale = await Sale.create({
      category,
      product,
      customerEmail,
      customerName,
      quantity,
      totalPrice,
    });

    res.status(201).json({ success: true, data: sale });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: error.message });
  }
};
exports.getSalesCount = async (req, res) => {
  try {
    const sales = await Sale.find().countDocuments();
    res.status(200).json({ success: true, data: sales });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find();
    res.status(200).json({ success: true, data: sales });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteSales = deleteOne(Sale);
