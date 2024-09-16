const express = require("express");

const AuthService = require("../services/authService");
const {
  createOrder,
  getCurrentOrders,
  getPastOrders,
  updateOrder,
  getAllOrders,
} = require("../services/orderService");

const router = express.Router();
router
  .route("/")
  .post(AuthService.protect, AuthService.allowedTo("admin"), createOrder)
  .get(AuthService.protect, AuthService.allowedTo("admin"), getAllOrders);
router
  .route("/:id")
  .patch(AuthService.protect, AuthService.allowedTo("admin"), updateOrder);
router
  .route("/current")
  .get(AuthService.protect, AuthService.allowedTo("admin"), getCurrentOrders);
router
  .route("/past")
  .get(AuthService.protect, AuthService.allowedTo("admin"), getPastOrders);
module.exports = router;
