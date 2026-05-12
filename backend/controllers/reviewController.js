import Product from '../models/Product.js';
import Review from '../models/Review.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import { sendSuccess } from '../utils/response.js';

const updateProductRatings = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  await Product.findByIdAndUpdate(productId, {
    averageRating: stats[0]?.averageRating || 0,
    reviewCount: stats[0]?.reviewCount || 0
  });
};

export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
  sendSuccess(res, 200, 'Reviews fetched successfully', { reviews });
});

export const createReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const review = await Review.findOneAndUpdate(
    { user: req.user._id, product: req.params.productId },
    {
      rating: req.body.rating,
      title: req.body.title,
      comment: req.body.comment
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true
    }
  );

  await updateProductRatings(product._id);
  sendSuccess(res, 201, 'Review saved successfully', { review });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new AppError('Review not found', 404);
  }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('You cannot delete this review', 403);
  }

  const productId = review.product;
  await review.deleteOne();
  await updateProductRatings(productId);

  sendSuccess(res, 200, 'Review deleted successfully');
});
