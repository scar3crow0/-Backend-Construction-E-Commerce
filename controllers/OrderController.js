const Order = require("../models/ordermodel");

const createOrder = async (req, res) => {
  try {
    const {
      products,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    const userId = req.user.userId;
    console.log("test1:", userId);

    if (products && products.length === 0) {
      res.status(400);
      throw new Error("No order items");
    } else {
      console.log("test2:", userId);
      const order = new Order({
        user: userId,
        products,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });

      const createdOrder = await order.save();

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const GetMyOrders = async (req, res) => {
  console.log("test1");
  try {
    // Fetch orders for the logged-in user
    console.log("test2");
    const orders = await Order.find({ user: req.user.userId });
    console.log("test3");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const GetOrderbyId = async (req, res) => {
//   try {
//     const orderId = req.params.id;

//     // Retrieve order details by order ID
//     const order = await Order.findById(orderId).populate("user", "name email");

//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     res.status(200).json(order);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

module.exports = {
  createOrder,
  GetMyOrders,
  //GetOrderbyId,
};
