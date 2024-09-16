const express = require("express");
const {
  generateInvoiceFromQuote,
  trackPaymentsAndPendingInvoices,
  getInvoiceAccepted,
  getInvoiceNotAccepted,
  downloadInvoice,
  updateInvoice,
} = require("../services/invoiceService");

const router = express.Router();

router.post("/:id/generate", generateInvoiceFromQuote);
router.patch("/updateInvoince/:invoiceId", updateInvoice);
router.get("/accepted", getInvoiceAccepted);
router.get("/pending", getInvoiceNotAccepted);
router.get("/download/:invoiceId", downloadInvoice);

module.exports = router;
