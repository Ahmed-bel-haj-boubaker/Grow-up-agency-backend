// routes/reportRoute.js
const express = require("express");
const AuthService = require("../services/authService");
const {
  getSupplier,
  addSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  getAllSuppliers,
} = require("../services/supllierService");

const router = express.Router();
router
  .route("/allSuppliers")
  .get(AuthService.protect, AuthService.allowedTo("admin"), getAllSuppliers);
router
  .route("/")
  .get(AuthService.protect, AuthService.allowedTo("admin"), getSupplier)
  .post(AuthService.protect, AuthService.allowedTo("admin"), addSupplier);
router
  .route("/:id")
  .get(AuthService.protect, AuthService.allowedTo("admin"), getSupplierById)
  .put(AuthService.protect, AuthService.allowedTo("admin"), updateSupplier)
  .delete(AuthService.protect, AuthService.allowedTo("admin"), deleteSupplier);

module.exports = router;
