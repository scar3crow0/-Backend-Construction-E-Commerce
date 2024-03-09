const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: "text", // Enable text indexing on the 'name' field
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
