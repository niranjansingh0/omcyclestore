import Product from '../models/Product.js';
import Review from '../models/Review.js';
import APIFeatures from '../utils/apiFeatures.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import { sendSuccess } from '../utils/response.js';
import { slugify } from '../utils/helpers.js';
import { uploadBuffer } from '../services/cloudinaryService.js';

const parseArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseSpecifications = (value) => {
  if (!value) return undefined;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return undefined;
  }
};

const isPrivilegedAdminRequest = (req) =>
  req.baseUrl?.includes('/admin') && ['admin', 'manager'].includes(req.user?.role);

export const getProducts = asyncHandler(async (req, res) => {
  const isAdminRequest = isPrivilegedAdminRequest(req);
  const visibilityFilter = isAdminRequest ? {} : { isActive: true };
  const baseQuery = Product.find(visibilityFilter).populate('category', 'name slug type');
  const features = new APIFeatures(baseQuery, req.query)
    .search(['name', 'description', 'brand', 'tags'])
    .filter()
    .sort('-createdAt')
    .paginate();

  const products = await features.query;

  const countQuery = Product.find(visibilityFilter);
  const countFeatures = new APIFeatures(countQuery, req.query).search([
    'name',
    'description',
    'brand',
    'tags'
  ]).filter();
  const total = await countFeatures.query.countDocuments();

  sendSuccess(res, 200, 'Products fetched successfully', {
    products,
    pagination: {
      total,
      page: features.pagination.page,
      limit: features.pagination.limit,
      pages: Math.ceil(total / features.pagination.limit)
    }
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const isAdminRequest = isPrivilegedAdminRequest(req);
  const product = await Product.findById(req.params.id).populate('category', 'name slug type');
  if (!product || (!isAdminRequest && !product.isActive)) {
    throw new AppError('Product not found', 404);
  }

  const reviews = await Review.find({ product: product._id }).populate('user', 'name');

  sendSuccess(res, 200, 'Product fetched successfully', {
    product,
    reviews
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const images = [];

  // Handle file uploads (store as base64)
  if (req.files?.length) {
    for (const file of req.files) {
      const base64 = file.buffer.toString('base64');
      const mimeType = file.mimetype;
      images.push({
        public_id: null,
        url: `data:${mimeType};base64,${base64}`
      });
    }
  }

  // Handle URL images from form data
  if (req.body.imageUrls) {
    const urls = Array.isArray(req.body.imageUrls) ? req.body.imageUrls : [req.body.imageUrls];
    for (const url of urls) {
      if (url && typeof url === 'string') {
        images.push({ public_id: null, url });
      }
    }
  }

  const product = await Product.create({
    ...req.body,
    slug: req.body.slug || slugify(req.body.name),
    sku: req.body.sku.toUpperCase(),
    tags: parseArray(req.body.tags),
    specifications: parseSpecifications(req.body.specifications),
    images
  });

  sendSuccess(res, 201, 'Product created successfully', { product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  let images = product.images;

  // Handle file uploads (store as base64)
  if (req.files?.length) {
    images = [];
    for (const file of req.files) {
      const base64 = file.buffer.toString('base64');
      const mimeType = file.mimetype;
      images.push({
        public_id: null,
        url: `data:${mimeType};base64,${base64}`
      });
    }
  }

  // Handle URL images from form data
  if (req.body.imageUrls) {
    const urls = Array.isArray(req.body.imageUrls) ? req.body.imageUrls : [req.body.imageUrls];
    images = urls.filter(url => url && typeof url === 'string').map(url => ({ public_id: null, url }));
  }

  const payload = {
    ...req.body,
    images,
    tags: req.body.tags ? parseArray(req.body.tags) : product.tags,
    specifications: req.body.specifications
      ? parseSpecifications(req.body.specifications)
      : product.specifications
  };

  if (payload.name && !payload.slug) {
    payload.slug = slugify(payload.name);
  }

  if (payload.sku) {
    payload.sku = payload.sku.toUpperCase();
  }

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });

  sendSuccess(res, 200, 'Product updated successfully', { product: updatedProduct });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  sendSuccess(res, 200, 'Product deleted successfully');
});

export const updateProductStock = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { stock: req.body.stock },
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  sendSuccess(res, 200, 'Stock updated successfully', { product });
});
