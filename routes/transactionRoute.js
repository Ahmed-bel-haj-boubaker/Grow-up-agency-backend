const express = require("express");

const router = express.Router();
const AuthService = require("../services/authService");
const {
  transactionTypeIn,
  transactionTypeOut,
  getAllTransactionTypeIn,
  getAllTransactionTypeOut,
  deleteTransactionTypeIn,
  deleteTransaction,
} = require("../services/transactionService");

router
  .route("/transaction-type-in")
  .get(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    getAllTransactionTypeIn
  )
  .post(AuthService.protect, AuthService.allowedTo("admin"), transactionTypeIn);
router
  .route("/transaction-type-out")
  .post(AuthService.protect, AuthService.allowedTo("admin"), transactionTypeOut)
  .get(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    getAllTransactionTypeOut
  );

router
  .route("/:id")
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deleteTransaction
  );
module.exports = router;
