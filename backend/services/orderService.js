import Product from '../models/Product.js';
import AppError from '../utils/appError.js';

export const validateAndPrepareOrderItems = async (items) => {
  if (!Array.isArray(items) || !items.length) {
    throw new AppError('Order items are required', 400);
  }

  const preparedItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product || !product.isActive) {
      throw new AppError('One or more products are unavailable', 400);
    }

    if (product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${product.name}`, 400);
    }

    const unitPrice = product.price;
    const subtotal = unitPrice * item.quantity;

    preparedItems.push({
      product: product._id,
      name: product.name,
      sku: product.sku,
      image: product.images[0]?.url,
      quantity: item.quantity,
      price: unitPrice,
      subtotal
    });

    totalAmount += subtotal;
  }

  return { preparedItems, totalAmount };
};
