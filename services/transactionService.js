const expressAsyncHandler = require("express-async-handler");
const Product = require("../models/product");
const Transaction = require("../models/transaction");
const { deleteOne } = require("./handlersFactory");

exports.transactionTypeIn = expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.body.idProduct);
  if (!product) {
    res.status(404).json({ message: "there is no product with that id" });
  }

  const transaction = new Transaction();
  transaction.product = req.body.idProduct;
  transaction.quantity = req.body.quantity;
  transaction.type = req.body.type;

  await transaction.save();

  product.stockQuantity += transaction.quantity;

  product.save();

  return res.status(201).json({
    transaction: transaction,
    msg: "transaction created successfully",
  });
});

exports.transactionTypeOut = expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.body.idProduct);
  if (!product) {
    res.status(404).json({ message: "there is no product with that id" });
  }

  const transaction = new Transaction();
  transaction.product = req.body.idProduct;
  transaction.quantity = req.body.quantity;
  transaction.type = req.body.type;

  await transaction.save();

  product.stockQuantity -= transaction.quantity;

  product.save();

  return res.status(201).json({
    transaction: transaction,
    msg: "transaction created successfully",
  });
});

exports.getAllTransactionTypeIn = expressAsyncHandler(async (req, res) => {
  const transaction = await Transaction.find({ type: "in" });
  if (!transaction) {
    res.status(404).json({ message: "there is no transaction with that id" });
  } else {
    res.status(200).json({ transaction: transaction });
  }
});
exports.getAllTransactionTypeOut = expressAsyncHandler(async (req, res) => {
  const transaction = await Transaction.find({ type: "out" });
  if (!transaction) {
    res.status(404).json({ message: "there is no transaction with that id" });
  } else {
    res.status(200).json({ transaction: transaction });
  }
});

exports.deleteTransaction = deleteOne(Transaction);
