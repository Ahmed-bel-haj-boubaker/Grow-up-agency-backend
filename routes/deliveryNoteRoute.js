// routes/deliveryNoteRoute.js
const express = require("express");
const {
  createDeliveryNote,
  getDeliveryNotes,
  updateDeliveryNote,
  deleteDeliveryNote,
} = require("../services/deliveryNoteService");
const AuthService = require("../services/authService");

const router = express.Router();

router.post(
  "/",
  AuthService.protect,
  AuthService.allowedTo("admin"),
  createDeliveryNote
);
router.get(
  "/",
  AuthService.protect,
  AuthService.allowedTo("admin"),
  getDeliveryNotes
);
router.put(
  "/:id",
  AuthService.protect,
  AuthService.allowedTo("admin"),
  updateDeliveryNote
);
router.delete(
  "/:id",
  AuthService.protect,
  AuthService.allowedTo("admin"),
  deleteDeliveryNote
);

module.exports = router;
