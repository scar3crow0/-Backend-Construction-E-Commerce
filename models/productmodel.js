// productmodel.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    index: "text", // Enable text indexing on the 'name' field
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true, // Store image content type
  },
  brand: {
    type: String,
    required: true,
    index: "text", // Enable text indexing on the 'brand' field
  },
  category: {
    type: String,
    required: true,
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  // Other fields in your product model
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
