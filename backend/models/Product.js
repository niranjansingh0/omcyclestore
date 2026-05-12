import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    shortDescription: {
      type: String,
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required']
    },
    brand: {
      type: String,
      trim: true
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    productType: {
      type: String,
      enum: [
        'cycle-part',
        'bicycle-accessory',
        'electronics-accessory',
        'general-shop-product',
        'service'
      ],
      default: 'general-shop-product'
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    compareAtPrice: {
      type: Number,
      min: 0
    },
    costPrice: {
      type: Number,
      min: 0
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0
    },
    images: [
      {
        public_id: String,
        url: String
      }
    ],
    specifications: {
      type: Map,
      of: String
    },
    tags: [String],
    isActive: {
      type: Boolean,
      default: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    soldCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1, stock: 1, isActive: 1 });

export default mongoose.model('Product', productSchema);
