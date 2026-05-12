import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import { sendSuccess } from '../utils/response.js';

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await cart.populate('items.product');
  }
  return cart;
};

const buildCartSummary = (cart) => {
  const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  return { totalAmount, totalItems };
};

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  sendSuccess(res, 200, 'Cart fetched successfully', {
    cart,
    summary: buildCartSummary(cart)
  });
});

export const addToCart = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.body.product);
  if (!product || !product.isActive) {
    throw new AppError('Product not found', 404);
  }

  if (product.stock < req.body.quantity) {
    throw new AppError('Requested quantity is not available', 400);
  }

  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.items.find((item) => item.product._id.toString() === product._id.toString());

  if (existingItem) {
    existingItem.quantity += req.body.quantity;
    existingItem.price = product.price;
  } else {
    cart.items.push({
      product: product._id,
      quantity: req.body.quantity,
      price: product.price
    });
  }

  await cart.save();
  await cart.populate('items.product');

  sendSuccess(res, 200, 'Item added to cart', {
    cart,
    summary: buildCartSummary(cart)
  });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);

  if (!item) {
    throw new AppError('Cart item not found', 404);
  }

  const product = await Product.findById(item.product);
  if (!product || product.stock < req.body.quantity) {
    throw new AppError('Requested quantity is not available', 400);
  }

  item.quantity = req.body.quantity;
  item.price = product.price;

  await cart.save();
  await cart.populate('items.product');

  sendSuccess(res, 200, 'Cart item updated', {
    cart,
    summary: buildCartSummary(cart)
  });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);

  if (!item) {
    throw new AppError('Cart item not found', 404);
  }

  item.deleteOne();
  await cart.save();
  await cart.populate('items.product');

  sendSuccess(res, 200, 'Item removed from cart', {
    cart,
    summary: buildCartSummary(cart)
  });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();

  sendSuccess(res, 200, 'Cart cleared successfully', {
    cart,
    summary: buildCartSummary(cart)
  });
});
