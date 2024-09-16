const express = require("express");

const AuthService = require("../services/authService");
const { getCustomers } = require("../services/customersService");

const router = express.Router();
router
  .route("/")
  .get(AuthService.protect, AuthService.allowedTo("admin"), getCustomers);

module.exports = router;
