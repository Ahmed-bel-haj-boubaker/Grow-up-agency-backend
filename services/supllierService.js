const expressAsyncHandler = require("express-async-handler");
const Supplier = require("../models/supplier");
const handlerFactory = require("./handlersFactory");

exports.addSupplier = handlerFactory.addDocument(Supplier);

exports.getSupplier = handlerFactory.getDocument(Supplier);

exports.getSupplierById = handlerFactory.getById(Supplier);

exports.updateSupplier = handlerFactory.updateOne(Supplier);

exports.deleteSupplier = handlerFactory.deleteOne(Supplier);

exports.getAllSuppliers = expressAsyncHandler(async (req, res) => {
  const suppliers = await Supplier.find();
  if (suppliers) {
    res.status(200).json({ data: suppliers });
  } else {
    return res.status(404).json({ msg: "there is no suppliers " });
  }
});
