const authRoute = require("./authRoute");
const productRoute = require("./productRoute");
const categoryRoute = require("./categoryRoute");
const transactionRoute = require("./transactionRoute");
const reportRoute = require("./reportRoute");
const salesRoute = require("./salesRoute");
const customersRoute = require("./customersRoute");
const supllierRoute = require("./supplierRoute");
const orderRoute = require("./orderRoute");
const purchaseOrderRoute = require("./purchaseOrderRoute");
const quoteRoute = require("./quoteRoute");
const invoiceRoute = require("./invoiceRoute");
const deliveryNoteRoute = require("./deliveryNoteRoute");

const mountRoutes = (app) => {
  //Routes
  app.use("/api/user", () => {});
  app.use("/api/auth", authRoute);
  app.use("/api/product", productRoute);
  app.use("/api/category", categoryRoute);
  app.use("/api/transactions", transactionRoute);
  app.use("/api/report", reportRoute);
  app.use("/api/sales", salesRoute);
  app.use("/api/customers", customersRoute);
  app.use("/api/suppliers", supllierRoute);
  app.use("/api/orders", orderRoute);
  app.use("/api/purchaseOrder", purchaseOrderRoute);
  app.use("/api/quote", quoteRoute);
  app.use("/api/invoice", invoiceRoute);
  app.use("/api/deliveryNote", deliveryNoteRoute);

};

module.exports = mountRoutes;
