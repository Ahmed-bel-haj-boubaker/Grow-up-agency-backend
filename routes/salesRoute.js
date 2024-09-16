// routes/reportRoute.js
const express = require("express");
const AuthService = require("../services/authService");
const {
  createSale,
  getSales,
  getSalesCount,
  deleteSales,
} = require("../services/saleService");

const router = express.Router();
router
  .route("/:id")
  .delete(AuthService.protect, AuthService.allowedTo("admin"), deleteSales);
router
  .route("/")
  .post(AuthService.protect, AuthService.allowedTo("admin"), createSale)
  .get(AuthService.protect, AuthService.allowedTo("admin"), getSalesCount)
  .delete(AuthService.protect, AuthService.allowedTo("admin"), deleteSales);
router
  .route("/allSales")
  .get(AuthService.protect, AuthService.allowedTo("admin"), getSales);

module.exports = router;
