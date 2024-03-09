const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const CartController = require("../controllers/CartController");

router.post("/", protect, CartController.addToCart);

router.get("/cartitems", protect, CartController.getCartItemsByUserId);

router.put(
  "/updateCartItemQuantity/:id",
  protect,
  CartController.updateCartItemQuantity
);

module.exports = router;
