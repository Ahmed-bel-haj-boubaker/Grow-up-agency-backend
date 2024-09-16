const expressAsyncHandler = require("express-async-handler");
const PurchaseOrder = require("../models/purchaseOrder");
const Product = require("../models/product");
const Supplier = require("../models/supplier");

exports.createPurchaseOrder = expressAsyncHandler(async (req, res) => {
  const { supplierId, orderItems } = req.body;
  console.log(req.body);
  let totalAmount = 0;
  const processedOrderItems = await Promise.all(
    orderItems.map(async (item) => {
      const product = await Product.findById(item.product_id);
      if (!product) {
        throw new Error(`Product not found: ${item.product_id}`);
      }
      totalAmount += product.price * item.quantity;
      return {
        product_id: product._id,
        quantity: item.quantity,
        price: product.price,
      };
    })
  );

  const newPurchaseOrder = await PurchaseOrder.create({
    supplier: supplierId,
    status: "Pending",
    total_amount: totalAmount,
    order_items: processedOrderItems,
  });

  res.status(201).json(newPurchaseOrder);
});
exports.getPurchaseOrders = expressAsyncHandler(async (req, res) => {
  const purchaseOrders = await PurchaseOrder.find().populate("supplier");

  res.status(200).json(purchaseOrders);
  console.log(purchaseOrders);
});
exports.updatePurchaseOrder = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, orderItems, product_id, quantity, supplierId } = req.body;

  console.log("Request Body:", req.body);

  if (status === "Approved") {
    const product = await Product.findById(product_id);
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }

    product.stockQuantity = Number(product.stockQuantity) + Number(quantity);
    await product.save();

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res
        .status(404)
        .json({ status: "error", message: "Supplier not found" });
    }

    console.log("Supplier Before Update:", supplier);
    console.log("OrderItems Before Push:", orderItems);

    // Assuming orderItems should not include _id
    const formattedOrderItems = orderItems.map(({ product_id, quantity }) => ({
      product_id,
      quantity,
    }));

    supplier.order_history.push(...formattedOrderItems);
    await supplier.save();

    console.log("Supplier After Update:", supplier);
  }

  const updatedOrder = await PurchaseOrder.findByIdAndUpdate(
    id,
    { status, order_items: orderItems },
    { new: true, runValidators: true }
  );

  if (!updatedOrder) {
    return res
      .status(404)
      .json({ status: "error", message: "Order not found" });
  }

  res.status(200).json(updatedOrder);
});

exports.deletePurchaseOrder = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedOrder = await PurchaseOrder.findByIdAndDelete(id);

  if (!deletedOrder) {
    return res
      .status(404)
      .json({ status: "error", message: "Order not found" });
  }

  res
    .status(200)
    .json({ status: "success", message: "Order deleted successfully" });
});
