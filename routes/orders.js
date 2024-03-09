const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const orderController = require("../controllers/OrderController");

//route for creating a new order.   //working
router.post("/", protect, orderController.createOrder);

//route for getting list of all orders of the user logged in.   //working
router.get("/MyOrders", protect, orderController.GetMyOrders);

//route for getting orders by id.
//router.get("/:id", orderController.GetOrderbyId);

module.exports = router;
