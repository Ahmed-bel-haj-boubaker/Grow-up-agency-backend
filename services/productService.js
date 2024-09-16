// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
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

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

// exports.resizeProductImages = asyncHandler(async (req, res, next) => {
//   // console.log(req.files);
//   //1- Image processing for imageCover
//   if (req.files.imageCover) {
//     const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

//     await sharp(req.files.imageCover[0].buffer)
//       .resize(2000, 1333)
//       .toFormat("jpeg")
//       .jpeg({ quality: 95 })
//       .toFile(`uploads/products/${imageCoverFileName}`);

//     // Save image into our db
//     req.body.imageCover = imageCoverFileName;
//   }
//   //2- Image processing for images
//   if (req.files.images) {
//     req.body.images = [];
//     await Promise.all(
//       req.files.images.map(async (img, index) => {
//         const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

//         await sharp(img.buffer)
//           .resize(2000, 1333)
//           .toFormat("jpeg")
//           .jpeg({ quality: 95 })
//           .toFile(`uploads/products/${imageName}`);

//         // Save image into our db
//         req.body.images.push(imageName);
//       })
//     );

//     next();
//   }
// });

exports.uploadProductImage = uploadSingleImage("image");

exports.resizeImageProduct = asyncHandler(async (req, res, next) => {
  const filename = `product-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`./uploads/products/${filename}`);
    req.body.image = filename;
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
