// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");
const handlerFactory = require("./handlersFactory");
const ProductModel = require("../models/product");
const {
  uploadMixOfImages,
  uploadSingleImage,
} = require("../middlewares/uploadImageMiddleware");
const product = require("../models/product");

exports.addProduct = handlerFactory.addDocument(ProductModel);

exports.getProduct = handlerFactory.getDocument(ProductModel);

exports.getProductById = handlerFactory.getById(ProductModel);

exports.updateProduct = handlerFactory.updateOne(ProductModel);

exports.deleteProduct = handlerFactory.deleteOne(ProductModel);

exports.uploadProductImage = uploadSingleImage("image");

exports.resizeImageProduct = asyncHandler(async (req, res, next) => {
  const filename = `product-${uuidv4()}-${Date.now()}.jpeg`;
  const uploadDir = path.join(__dirname, "../uploads/products");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  try {
    if (req.file) {
      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(path.join(uploadDir, filename));
      req.body.image = filename;
      console.log("req.body.image", req.body.image);
    }
  } catch (error) {
    console.error("Error processing image:", error);
    return res.status(500).json({ message: "Error processing image" });
  }

  next();
});

exports.getAllProduct = asyncHandler(async (req, res, next) => {
  try {
    const allProduct = await product.find();
    console.log(allProduct);

    return res.status(200).json({
      status: "success",
      data: {
        products: allProduct,
      },
    });
  } catch (error) {
    next(error); // Pass errors to the global error handler
  }
});
