const express = require("express");

const {
  addProduct,
  getProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  resizeImageProduct,
  getAllProduct,
} = require("../services/productService");

const AuthService = require("../services/authService");

const router = express.Router();
router
  .route("/allProducts")
  .get(AuthService.protect, AuthService.allowedTo("admin"), getAllProduct);
router
  .route("/")
  .get(getProduct)
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    uploadProductImage,
    resizeImageProduct,
    addProduct
  );
router
  .route("/:id")
  .get(getProductById)
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    uploadProductImage,
    resizeImageProduct,
    updateProduct
  )
  .delete(AuthService.protect, AuthService.allowedTo("admin"), deleteProduct);

module.exports = router;
