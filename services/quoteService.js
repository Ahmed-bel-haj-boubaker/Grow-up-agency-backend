const expressAsyncHandler = require("express-async-handler");
const Product = require("../models/product");
const Quote = require("../models/quote");
const handlerFactory = require("./handlersFactory");

exports.createQuote = expressAsyncHandler(async (req, res) => {
  const { quoteItems } = req.body;

  if (!Array.isArray(quoteItems) || quoteItems.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Quote items must be a non-empty array.",
    });
  }

  let totalAmount = 0;

  const items = await Promise.all(
    quoteItems.map(async (item) => {
      const product = await Product.findById(item.product_id);
      if (!product) {
        throw new Error(`Product not found: ${item.product_id}`);
      }
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      return {
        product_id: product._id,
        quantity: item.quantity,
        price: product.price,
      };
    })
  );

  try {
    const newQuote = await Quote.create({
      quoteItems: items,
      totalAmount,
    });
    res.status(201).json(newQuote);
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

exports.modifyQuote = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quoteItems, status } = req.body;

  const quote = await Quote.findById(id);
  if (!quote) {
    return res.status(404).json({ message: "Quote not found" });
  }

  if (quoteItems) {
    quote.quoteItems = quoteItems;
    quote.totalAmount = quoteItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  quote.status = status || quote.status;

  // Save the updated quote
  try {
    const updatedQuote = await quote.save();
    res.json(updatedQuote);
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

exports.getAllQuotes = expressAsyncHandler(async (req, res) => {
  const quotes = await Quote.find().populate("quoteItems");
  res.status(200).json({ data: quotes });
});

exports.deleteQuote = handlerFactory.deleteOne(Quote);
