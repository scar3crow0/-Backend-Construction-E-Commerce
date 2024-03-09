const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5001;
app.use(express.json());
app.use(cors());

// Connect to MongoDB using your MongoDB Atlas connection string
mongoose
  .connect(
    "mongodb+srv://construction_abdullah:AkbazKndQ6KduFEo@cluster101.3virq8p.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });

// Your Express routes will go here

const cartRoutes = require("./routes/cart");

app.use("/cart", cartRoutes);

const productsRoutes = require("./routes/products");

app.use("/products", productsRoutes);

const OrderRoutes = require("./routes/orders");

app.use("/orders", OrderRoutes);

const usersRoute = require("./routes/users");

// Use the users route for any requests starting with /users
app.use("/users", usersRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
