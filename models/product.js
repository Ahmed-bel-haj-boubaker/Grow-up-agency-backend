const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
    },
    stockQuantity: {
      type: Number,
    },

    price: {
      type: Number,
      trim: true,
    },

    image: String,
    //images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
    supplier: {
      type: mongoose.Schema.ObjectId,
      ref: "Supplier",
    },
  },
  { timestamps: true }
);
const setImageURL = (doc) => {
  console.log("doc.image", doc.image);
  if (doc.image && !doc.image.startsWith(process.env.BASE_URL)) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.image}`;
    doc.image = imageUrl;
  }
};

// findOne, findAll and update
productSchema.post("init", (doc) => {
  setImageURL(doc);
});
productSchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("Product", productSchema);
