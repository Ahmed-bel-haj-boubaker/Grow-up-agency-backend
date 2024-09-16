// routes/reportRoute.js
const express = require("express");
const { getReport } = require("../services/report");
const AuthService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(AuthService.protect, AuthService.allowedTo("admin"), getReport);

module.exports = router;
