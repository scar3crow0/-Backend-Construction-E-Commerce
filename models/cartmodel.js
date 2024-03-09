// cartItem.model.js

const mongoose = require("mongoose");

// Define the schema for the cart item
const cartItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model for associating with a user
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference to the Product model for associating with a product
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

// Create the CartItem model using the schema
const CartItem = mongoose.model("CartItem", cartItemSchema);

module.exports = CartItem;
