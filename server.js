const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const dbConnection = require("./config/database");
// eslint-disable-next-line import/order
const path = require("path");

const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddlewares");
const mountRoutes = require("./routes/index");

dotenv.config({ path: ".env" });

dbConnection();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}
const addStaticDirectory = (route, directory) => {
  app.use(route, express.static(path.join(__dirname, directory)));
};

// Add your static directories
addStaticDirectory("/categories", "uploads/categories");
addStaticDirectory("/products", "uploads/products");

mountRoutes(app);
app.all("*", (req, res, next) => {
  // Create Error and send it to error handling middleware
  const err = new Error(`Can't find this Route: ${req.originalUrl}`);
  // next(err.message)
  //OR Create a new error custom class
  next(new ApiError(`Can't find this Route: ${req.originalUrl}`, 400));
});

app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT} `);
});

// Handle Error rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Errors : ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down... `);
    process.exit(1);
  });
});
