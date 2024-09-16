const express = require("express");
const {
  createQuote,
  modifyQuote,
  deleteQuote,
  getAllQuotes,
} = require("../services/quoteService");

const router = express.Router();

router.post("/", createQuote);
router.get("/", getAllQuotes);
router.put("/:id", modifyQuote);
router.delete("/:id", deleteQuote);

module.exports = router;
