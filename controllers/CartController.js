// cartController.js
const mongoose = require("mongoose"); // Import mongoose

const Product = require("../models/productmodel"); // Import the Product model
const CartItem = require("../models/cartmodel"); // Import the CartItem model

// Controller function to add a product to the cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId; // Assuming you have implemented authentication middleware to attach the user object to the request

    // Retrieve the product details (name, image, price) based on the productId
    const product = await Product.findById(productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if the product already exists in the user's cart
    let cartItem = await CartItem.findOne({ productId });

    if (cartItem) {
      // If the product already exists, update the quantity
      cartItem.quantity += parseInt(quantity);
    } else {
      // If the product doesn't exist, create a new cart item
      cartItem = new CartItem({
        userId,
        productId,
        quantity: parseInt(quantity),
        name: product.name,
        image: product.image,
        price: product.price,
      });
    }

    // Save the cart item to the database
    await cartItem.save();

    res.status(201).json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCartItemsByUserId = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming you have implemented authentication middleware to attach the user object to the request

    // Find all cart items for the user
    const cartItems = await CartItem.find({ userId });

    // Map the cart items to extract product details along with quantity
    const formattedCartItems = await Promise.all(
      cartItems.map(async (item) => {
        // Retrieve the product details (name, image, price) based on the productId
        const product = await Product.findById(item.productId);
        if (!product) {
          return null; // Product not found
        }
        return {
          productId: item.productId,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: item.quantity,
        };
      })
    );

    // Filter out any null values (products not found)
    const filteredCartItems = formattedCartItems.filter(
      (item) => item !== null
    );

    res.status(200).json({ cartItems: filteredCartItems });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to update the quantity of an item in the cart
const updateCartItemQuantity = async (req, res) => {
  const { productId, quantity } = req.body; // Extract quantity from request body

  console.log("in da fucn");
  console.log("id", productId);
  console.log("quan:", quantity);

  try {
    // Find the cart item by productId
    let cartItem = await CartItem.findOne({ productId });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in the cart" });
    }

    // Update the quantity of the cart item
    cartItem.quantity = quantity;

    // Save the updated cart item
    await cartItem.save();

    return res
      .status(200)
      .json({ message: "Cart item quantity updated successfully", cartItem });
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addToCart, getCartItemsByUserId, updateCartItemQuantity };
