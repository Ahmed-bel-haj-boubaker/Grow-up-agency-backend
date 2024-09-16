const expressAsyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const Quote = require("../models/quote");
const Invoice = require("../models/invoice");
const product = require("../models/product");

// Generate Invoice from Quote
exports.generateInvoiceFromQuote = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  const quote = await Quote.findById(id).populate("quoteItems.product_id");
  console.log(quote.status);
  if (!quote || quote.status !== "Accepted") {
    res.status(400).json({ message: "Quote not found or not accepted" });
  }

  const invoiceExist = await Invoice.find({ quote: quote._id });
  console.log(invoiceExist);
  if (invoiceExist.length === 0) {
    const newInvoice = await Invoice.create({
      quote: quote._id,
      totalAmount: quote.totalAmount,
    });
    res.status(201).json(newInvoice);
  }
});

// Track Payments and Pending Invoices
exports.trackPaymentsAndPendingInvoices = expressAsyncHandler(
  async (req, res) => {
    const invoices = await Invoice.find({ status: "Unpaid" });
    res.json(invoices);
  }
);

// Get Accepted Quotes and Their Invoices
exports.getInvoiceAccepted = expressAsyncHandler(async (req, res) => {
  try {
    // Extract page and pageSize from query parameters (with default values)
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 items per page

    // Find accepted quotes
    const quotes = await Quote.find({ status: "Accepted" });

    // Filter invoices based on the accepted quotes
    const invoicesQuery = Invoice.find({
      quote: { $in: quotes.map((q) => q._id) },
    }).populate({
      path: "quote",
      select: "customerName customerEmail",
    });

    // Calculate the total number of invoices for pagination
    const totalItems = await invoicesQuery.clone().countDocuments();

    // Apply pagination: skip and limit based on the current page
    const invoices = await invoicesQuery
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      data: invoices,
      totalItems, // Send the total items count for frontend pagination
      totalPages: Math.ceil(totalItems / pageSize),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching accepted invoices:", error);
    res.status(500).json({ message: "Error fetching accepted invoices" });
  }
});

exports.updateInvoice = expressAsyncHandler(async (req, res) => {
  console.log(req.params);
  const { invoiceId } = req.params;
  const { status } = req.body;

  try {
    const allowedStatuses = ["Unpaid", "Paid"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({
      message: "Invoice status updated successfully",
      data: updatedInvoice,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

exports.getInvoiceNotAccepted = expressAsyncHandler(async (req, res) => {
  const quotes = await Quote.find({ status: { $in: ["Rejected", "Pending"] } });
  res.status(200).json({ data: quotes });
});

async function createInvoice(invoice, path) {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(path);

    stream.on("finish", () => resolve());
    stream.on("error", (err) => reject(err));

    doc.pipe(stream);

    // Colors and Fonts
    const primaryColor = "#2C3E50";
    const secondaryColor = "#34495E";
    const accentColor = "#1ABC9C";
    const whiteColor = "#FFFFFF";
    const tableHeaderFontSize = 12;
    const tableRowFontSize = 11;

    // Header with Company Information
    doc
      .fillColor(primaryColor)
      .fontSize(20)
      .text("GROW Up AGENCY", { align: "center" })
      .fontSize(12)
      .fillColor(secondaryColor)
      .text("Address Line 1 | Address Line 2", { align: "center" })
      .text("City, State, ZIP", { align: "center" })
      .text("Phone: 123-456-7890 | Email: info@company.com", {
        align: "center",
      })
      .moveDown(2);

    // Invoice Title
    doc
      .fillColor(accentColor)
      .fontSize(22)
      .text("INVOICE", { align: "center", underline: true })
      .moveDown(1);

    // Invoice Information
    const invoiceInfoTop = doc.y;
    doc
      .fontSize(12)
      .fillColor(secondaryColor)
      .text(`Invoice Number: ${invoice._id}`, 50, invoiceInfoTop)
      .text(`Invoice Date: ${new Date().toLocaleDateString()}`, 50, doc.y + 15)
      .text(`Due Date: ${new Date().toLocaleDateString()}`, 50, doc.y + 15)
      .moveDown(1.5);

    // Table Headers
    const tableTop = doc.y;
    doc
      .fillColor(accentColor)
      .rect(50, tableTop, 500, 20)
      .fill()
      .fillColor(whiteColor)
      .fontSize(tableHeaderFontSize)
      .text("Product", 55, tableTop + 5, { width: 180 })
      .text("Quantity", 235, tableTop + 5, { width: 100, align: "right" })
      .text("Price (DT)", 335, tableTop + 5, { width: 100, align: "right" })
      .text("Total (DT)", 435, tableTop + 5, { width: 100, align: "right" });

    // Table Rows
    let totalAmount = 0;
    let position = tableTop + 25;

    // eslint-disable-next-line no-restricted-syntax
    for (const item of invoice.items) {
      const itemTotal = item.quantity * item.price;
      totalAmount += itemTotal;

      try {
        // Await the result of the asynchronous call
        // eslint-disable-next-line no-await-in-loop
        const prod = await product.findById(item.product_id);
        console.log(prod);

        doc
          .fillColor(secondaryColor)
          .fontSize(tableRowFontSize)
          .text(prod.title || "Product Name", 55, position, { width: 180 })
          .text(item.quantity.toString(), 235, position, {
            width: 100,
            align: "right",
          })
          .text(`${item.price.toFixed(2)}`, 335, position, {
            width: 100,
            align: "right",
          })
          .text(`${itemTotal.toFixed(2)}`, 435, position, {
            width: 100,
            align: "right",
          });
        position += 20;
      } catch (error) {
        console.error(
          `Error processing item with product ID ${item.product_id}`
        );
        doc
          .fillColor("#FF0000")
          .text("Error retrieving product details", 55, position, {
            width: 180,
          })
          .text(item.quantity.toString(), 235, position, {
            width: 100,
            align: "right",
          })
          .text(`${item.price.toFixed(2)}`, 335, position, {
            width: 100,
            align: "right",
          })
          .text(`${itemTotal.toFixed(2)}`, 435, position, {
            width: 100,
            align: "right",
          });
        position += 20;
      }
    }

    // Total Amount Row
    doc
      .moveDown(1)
      .fillColor(secondaryColor)
      .fontSize(12)
      .text("Total Amount:", 350, position + 15, { width: 100, align: "right" })
      .fillColor(primaryColor)
      .text(`${totalAmount.toFixed(2)} DT`, 460, position + 15, {
        width: 100,
        align: "right",
      })
      .moveDown(2);

    // Footer and Thank You Note
    doc
      .fillColor(secondaryColor)
      .fontSize(10)
      .text("Thank you for your business!", { align: "center" })
      .moveDown(1);

    // Finalize PDF file
    doc.end();
  });
}

exports.downloadInvoice = expressAsyncHandler(async (req, res) => {
  const { invoiceId } = req.params;

  // Fetching the invoice and populating related fields
  const invoice = await Invoice.findById(invoiceId).populate("quote");

  if (!invoice) {
    // No invoice? 😱 Time to tell the user.
    return res.status(404).json({ message: "Invoice not found" });
  }

  // Defining the path where the invoice PDF should be saved
  const invoicePath = path.resolve(
    __dirname,
    `../uploads/invoices/invoice_${invoiceId}.pdf`
  );

  try {
    // Create the invoice and save it to the specified path
    await createInvoice(
      {
        _id: invoice._id,
        customerName: invoice.quote.customerName,
        customerEmail: invoice.quote.customerEmail,
        items: invoice.quote.quoteItems,
      },
      invoicePath
    );

    // Checking if the file exists before downloading
    if (fs.existsSync(invoicePath)) {
      // Ready for download! 🎉
      res.download(invoicePath, `invoice_${invoiceId}.pdf`, (err) => {
        if (err) {
          console.error("Error during download:", err);
          return res.status(500).json({ message: "Error downloading invoice" });
        }
      });
    } else {
      // Oops, something went wrong in file creation! 😬
      res
        .status(500)
        .json({ message: "Invoice file not found after creation" });
    }
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({ message: "Error creating invoice" });
  }
});
