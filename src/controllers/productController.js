import Product from "../models/Product.js";
import { handleErrors } from "../utils/helpers.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.status(200).json({
        success: true,
        product,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { name, image, brand, category, description, price, countInStock } =
      req.body;

    const product = new Product({
      name,
      image,
      brand,
      category,
      description,
      numReviews: 0,
      price,
      countInStock,
    });

    const createdProduct = await product.save();

    res.status(201).json({
      success: true,
      product: createdProduct,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, image, brand, category, description, price, countInStock } =
      req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.image = image || product.image;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.description = description || product.description;
      product.price = price || product.price;
      product.countInStock = countInStock || product.countInStock;

      const updatedProduct = await product.save();

      res.status(200).json({
        success: true,
        product: updatedProduct,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.remove();
      res.status(200).json({
        success: true,
        message: "Product removed",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({
          success: false,
          message: "Product already reviewed",
        });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({
        success: true,
        message: "Review added",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};
