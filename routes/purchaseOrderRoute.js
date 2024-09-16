const express = require("express");
const {
  createPurchaseOrder,

  updatePurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrders,
} = require("../services/PurchaseOrderService");
const AuthService = require("../services/authService");

const router = express.Router();
router
  .route("/")
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    createPurchaseOrder
  );

router.get("/", getPurchaseOrders);

router.put("/:id", updatePurchaseOrder);

router.delete("/:id", deletePurchaseOrder);

module.exports = router;
