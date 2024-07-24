import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Review from "../models/Review.js";

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
export const addReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  const review = new Review({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await review.save();
  await product.save();

  res.status(201).json({ message: "Review added" });
});

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
export const getReviewsForProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId).populate(
    "reviews.user",
    "name"
  );

  if (product) {
    res.json(product.reviews);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Update a review
// @route   PUT /api/reviews/:reviewId
// @access  Private
export const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  if (review.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized");
  }

  review.rating = rating;
  review.comment = comment;

  await review.save();

  const product = await Product.findById(review.product);
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();

  res.json({ message: "Review updated" });
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Private
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  if (review.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await review.remove();

  const product = await Product.findById(review.product);
  product.reviews = product.reviews.filter(
    (r) => r._id.toString() !== req.params.reviewId
  );
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();

  res.json({ message: "Review removed" });
});
