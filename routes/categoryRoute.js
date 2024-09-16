const express = require("express");

const AuthService = require("../services/authService");

const router = express.Router();
const {
  addCategories,
  getCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  uploadBrandImage,
  resizeImage,
} = require("../services/categoryService");

router
  .route("/")
  .get(getCategory)
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    uploadBrandImage,
    resizeImage,
    addCategories
  );
router
  .route("/:id")
  .get(getCategoryById)
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updateCategory
  )
  .delete(AuthService.protect, AuthService.allowedTo("admin"), deleteCategory);

module.exports = router;
