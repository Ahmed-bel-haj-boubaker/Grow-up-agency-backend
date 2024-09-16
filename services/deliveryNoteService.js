const expressAsyncHandler = require("express-async-handler");
const DeliveryNote = require("../models/deliveryNote");
const Order = require("../models/order");

exports.createDeliveryNote = expressAsyncHandler(async (req, res) => {
  const { orderId, deliveryAddress, deliveryDate, trackingNumber } = req.body;
  console.log(req.body);
  // Find the associated order
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Create the delivery note
  const newDeliveryNote = await DeliveryNote.create({
    order: orderId,
    deliveryAddress,
    deliveryDate,
    trackingNumber,
  });

  res.status(201).json(newDeliveryNote);
});

exports.getDeliveryNotes = expressAsyncHandler(async (req, res) => {
  const deliveryNotes = await DeliveryNote.find().populate("order");
  res.json(deliveryNotes);
});

exports.updateDeliveryNote = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { deliveryAddress, deliveryDate, status, trackingNumber } = req.body;
  console.log(req.body);
  // Find the delivery note by ID
  const deliveryNote = await DeliveryNote.findById(id);
  if (!deliveryNote) {
    return res.status(404).json({ message: "Delivery note not found" });
  }

  // Update the delivery note
  deliveryNote.deliveryAddress =
    deliveryAddress || deliveryNote.deliveryAddress;
  deliveryNote.deliveryDate = deliveryDate || deliveryNote.deliveryDate;
  deliveryNote.status = status || deliveryNote.status;
  deliveryNote.trackingNumber = trackingNumber || deliveryNote.trackingNumber;

  await deliveryNote.save();
  res.json(deliveryNote);
});

exports.deleteDeliveryNote = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  await DeliveryNote.findByIdAndDelete(id);

  res.json({ message: "Delivery note removed" });
});
