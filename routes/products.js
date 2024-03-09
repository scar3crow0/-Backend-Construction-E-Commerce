// products.js
const { protect } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const multer = require("multer");
const upload = require("../middleware/ImageUploadMiddleware");

// Route for getting popular products with pagination, filtering, and sorting  //working
router.get("/popular", productController.getPopularProducts);

//route for getting all products added by the logged in user.
router.get("/userProducts", protect, productController.getProductsByUser);

//route for getting a single product by id,     //working
router.get("/:id", productController.getProductbyId);

// Route for getting products in a specific category with pagination, filtering, and sorting    //working
router.get("/category/:category", productController.getProductsByCategory);

// Route for searching products based on name or brand with pagination, filtering, and sorting
router.get("/search", productController.searchProducts);

// route for getting all reviews by product id and in desc order.    //working
router.get("/reviews/:id", productController.getReviews);

// Route for deleting a product by ID   //working
router.delete("/:id", protect, productController.deleteProduct);

// Route for creating a new product    //working
router.post(
  "/",
  protect,
  upload.single("image"),
  productController.createProduct
);

//route for making new review.      //working
router.post("/createReview", productController.createReview);

// Route for updating a product   // working
router.put("/:id", protect, productController.updateProduct);

module.exports = router;
