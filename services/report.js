// routes/report.js
const express = require("express");

const router = express.Router();
const PDFDocument = require("pdfkit");
const { Parser } = require("json2csv");

const product = require("../models/product");

const getDataForReport = async () => {
  try {
    const products = await product.find().populate("supplier category");
    console.log(products);
    const data = products.map((p) => ({
      produit: p.title,
      categorie: p.category.name,
      quantité: p.stockQuantity,
      prix: p.price,
      fournisseur: p.supplier.name,
      fournisseurNumero: p.supplier.contact_info.phone,
      date: p.createdAt,
    }));
    return data;
  } catch (error) {
    console.error("Failed to fetch data for report", error);
    throw new Error("Data fetching error");
  }
};

const getReport = async (req, res) => {
  try {
    const data = await getDataForReport(); // Fetch data for the report
    console.log(data);
    // Check the desired format
    const format = req.query.format || "pdf"; // Default to PDF

    if (format === "pdf") {
      generatePDFReport(data, res);
    } else if (format === "csv") {
      generateCSVReport(data, res);
    } else {
      res.status(400).send("Invalid format");
    }
  } catch (error) {
    console.error("Failed to generate report", error);
    res.status(500).send("Internal Server Error");
  }
};

function generatePDFReport(data, res) {
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=report.pdf");

  doc.pipe(res);
  doc.fontSize(18).text("Stock Report", { align: "center" });
  doc.moveDown();

  data.forEach((item) => {
    doc.fontSize(12).text(`Product: ${item.product}`);
    doc.fontSize(12).text(`Category: ${item.category}`);
    doc.fontSize(12).text(`Quantity: ${item.quantity}`);
    doc.fontSize(12).text(`Price: ${item.price}`);
    doc.moveDown();
  });

  doc.end();
}

function generateCSVReport(data, res) {
  const parser = new Parser();
  const csv = parser.parse(data);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=report.csv");
  res.status(200).send(csv);
}

module.exports = {
  getReport,
  router,
};
