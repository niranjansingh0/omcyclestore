import Category from '../models/Category.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import { sendSuccess } from '../utils/response.js';
import { slugify } from '../utils/helpers.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('name');

  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => ({
      ...category.toObject(),
      productCount: await Product.countDocuments({ category: category._id, isActive: true })
    }))
  );

  sendSuccess(res, 200, 'Categories fetched successfully', {
    categories: categoriesWithCounts
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({
    ...req.body,
    slug: req.body.slug || slugify(req.body.name)
  });

  sendSuccess(res, 201, 'Category created successfully', { category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.name && !payload.slug) {
    payload.slug = slugify(payload.name);
  }

  const category = await Category.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  sendSuccess(res, 200, 'Category updated successfully', { category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  const productsCount = await Product.countDocuments({ category: category._id });
  if (productsCount) {
    throw new AppError('Cannot delete category with linked products', 400);
  }

  await category.deleteOne();
  sendSuccess(res, 200, 'Category deleted successfully');
});
