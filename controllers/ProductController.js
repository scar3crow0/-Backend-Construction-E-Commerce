const Product = require("../models/productmodel");
const Review = require("../models/reviewmodel");
const upload = require("multer");

const createProduct = async (req, res) => {
  try {
    const { name, description, price, brand, category } = req.body;

    const image = req.file;

    console.log("oogabooga");

    // Check if an image file was uploaded
    if (!image) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // Save the uploaded image file path
    const imagefilename = image.filename;

    console.log(imagefilename);

    // Create a new product instance
    const newProduct = new Product({
      user: req.user.userId,
      name,
      description,
      price,
      image: imagefilename, // Store the image path in the database
      brand,
      category,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductsByUser = async (req, res) => {
  try {
    // Fetch products added by the logged-in user
    const products = await Product.find({ user: req.user.userId });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if the product with the given ID exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete the product
    await existingProduct.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductbyId = async (req, res) => {
  try {
    const productId = req.params.id;

    // Retrieve product details by product ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Productttt not found" });
    }

    // Extract relevant details for the product detail section
    const productDetails = {
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      brand: product.brand,
    };

    res.status(200).json(productDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  console.log("oogabooga");
  try {
    const productId = req.params.id;
    const updateFields = req.body;

    const existingProduct = await Product.findById(productId);
    console.log("oogabooga1");
    if (!existingProduct) {
      console.log("oogabooga2");
      return res.status(404).json({ error: "Product not found" });
    }
    console.log("oogabooga3");
    Object.assign(existingProduct, updateFields);

    const updatedProduct = await existingProduct.save();

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPopularProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const maxPrice = parseInt(req.query.maxPrice) || undefined;
    const sortBy = req.query.sortBy || "numberOfReviews"; // Default sorting by reviews
    const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;

    // Query conditions
    let queryConditions = {};

    if (maxPrice) {
      queryConditions.price = { $lte: maxPrice };
    }

    const totalProductsCount = await Product.countDocuments(queryConditions);

    const totalPages = Math.ceil(totalProductsCount / limit);

    const startIndex = (page - 1) * limit;

    let query = Product.find(queryConditions);

    const sortObject = {};
    sortObject[sortBy] = sortDirection;

    const products = await query.sort(sortObject).skip(startIndex).limit(limit);

    res.status(200).json({
      products,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const maxPrice = parseInt(req.query.maxPrice) || undefined;
    const sortBy = req.query.sortBy || "numberOfReviews"; // Default sorting by reviews
    const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;

    // Query conditions
    let queryConditions = { category };

    if (maxPrice) {
      queryConditions.price = { $lte: maxPrice };
    }

    const totalProductsCount = await Product.countDocuments(queryConditions);

    const totalPages = Math.ceil(totalProductsCount / limit);

    const startIndex = (page - 1) * limit;

    let query = Product.find(queryConditions);

    const sortObject = {};

    sortObject[sortBy] = sortDirection;

    const products = await query.sort(sortObject).skip(startIndex).limit(limit);

    res.status(200).json({
      products,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const searchQuery = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const maxPrice = parseInt(req.query.maxPrice) || undefined;
    const sortBy = req.query.sortBy || "numberOfReviews";

    const startIndex = (page - 1) * limit;

    let query = Product.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { brand: { $regex: searchQuery, $options: "i" } },
      ],
    });

    if (maxPrice) {
      query = query.where("price").lte(maxPrice);
    }

    const products = await query
      .sort({ [sortBy]: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.ceil(products.length / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    // Extract review details from the request body
    const { productId, name, rating, comment } = req.body;

    // Create a new review
    const newReview = new Review({
      name,
      rating,
      comment,
    });

    // Save the review to the database
    const savedReview = await newReview.save();

    // Associate the review with the specific product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.reviews.push(savedReview._id);
    product.numberOfReviews += 1;

    await product.save();

    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const productId = req.params.id; // Assuming the product ID is passed in the route parameters

    // Check if the product with the given ID exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Fetch reviews for the product, limiting to 9 reviews and sorting by highest rating to lowest rating
    const reviews = await Review.find({ _id: { $in: product.reviews } })
      .sort({ rating: -1 }) // Sort by highest rating to lowest rating
      .limit(9);

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getReviews,
  createReview,
  getProductbyId,
  createProduct,
  deleteProduct,
  updateProduct,
  getPopularProducts,
  getProductsByCategory,
  searchProducts,
  getProductsByUser,
};
