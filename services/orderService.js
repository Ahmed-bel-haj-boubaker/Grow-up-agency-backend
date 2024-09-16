const expressAsyncHandler = require("express-async-handler");
const Product = require("../models/product");
const Order = require("../models/order");
const Supplier = require("../models/supplier");
const Customers = require("../models/customers");
const ApiError = require("../utils/apiError");

exports.createOrder = expressAsyncHandler(async (req, res) => {
  const { customerName, customerEmail, phoneNumber, address, orderItems } =
    req.body;

  console.log(req.body);
  if (!orderItems || !Array.isArray(orderItems)) {
    return res
      .status(400)
      .json({ status: "error", message: "orderItems must be an array." });
  }

  const customers = await Customers.findOne({ email: customerEmail });
  if (!customers) {
    await Customers.create({
      email: customerEmail,
      fullName: customerName,
      adresse: address,
      phoneNumber: phoneNumber,
    });
  }

  let totalAmount = 0;
  const processedOrderItems = await Promise.all(
    orderItems.map(async (item) => {
      const product = await Product.findById(item.product_id).populate("image");
      if (!product) {
        throw new Error(`Product not found: ${item.product_id}`);
      }
      if (item.quantity > product.stockQuantity) {
        throw new ApiError(`la quantity choisi n'est pas disponible `);
      }
      totalAmount += product.price * item.quantity;
      return {
        product_id: product._id,
        quantity: item.quantity,
        price: product.price,
      };
    })
  );

  const newOrder = await Order.create({
    customerName: customerName,
    customerEmail: customerEmail,
    total_amount: totalAmount,
    order_items: processedOrderItems,
  });
  console.log(newOrder);
  res.status(201).json(newOrder);
});

exports.getCurrentOrders = expressAsyncHandler(async (req, res) => {
  const currentStatuses = ["Pending"];
  const orders = await Order.find({
    status: { $in: currentStatuses },
  });
  res.status(200).json(orders);
});
exports.getPastOrders = expressAsyncHandler(async (req, res) => {
  const pastStatuses = ["Cancelled", "Completed"];
  const orders = await Order.find({ status: { $in: pastStatuses } });
  res.status(200).json(orders);
});

exports.updateOrder = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, product_ids, quantities } = req.body;

  if (status === "Completed") {
    // Ensure product_ids and quantities are arrays with the same length
    if (product_ids.length !== quantities.length) {
      return res
        .status(400)
        .json({ message: "Product IDs and quantities length mismatch" });
    }

    for (let i = 0; i < product_ids.length; i++) {
      const product = await Product.findById(product_ids[i]);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with id ${product_ids[i]} not found` });
      }

      const newQuantity = product.stockQuantity - quantities[i];
      if (newQuantity < 0) {
        return res
          .status(400)
          .json({ message: `Not enough stock for product ${product.name}` });
      }

      product.stockQuantity = newQuantity;
      await product.save();
    }
  }

  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (status) order.status = status;

  const savedOrder = await order.save();
  res.json(savedOrder);
});

exports.getAllOrders = expressAsyncHandler(async (req, res) => {
  const orders = await Order.find();
  console.log(orders);
  res.status(200).json({ data: orders });
});
