// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");
const expressAsyncHandler = require("express-async-handler");
const handlerFactory = require("./handlersFactory");
const CategoryModel = require("../models/category");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const product = require("../models/product");

exports.addCategories = handlerFactory.addDocument(CategoryModel);

exports.getCategory = handlerFactory.getDocument(CategoryModel);

exports.getCategoryById = handlerFactory.getById(CategoryModel);

exports.updateCategory = handlerFactory.updateOne(CategoryModel);
// handlerFactory.deleteOne(CategoryModel);
exports.deleteCategory = expressAsyncHandler(async (req, res) => {
  const catId = req.params.id;

  const prod = await product.deleteMany({ category: catId });
  await CategoryModel.deleteOne({ _id: catId });
  console.log(prod);

  return res.status(200).json({ msg: "categorie is deleted" });
});

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  console.log("filename", req.file);
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`./uploads/categories/${filename}`);
    req.body.image = filename;
    console.log("req.body.image", req.body.image);
  }

  next();
});
