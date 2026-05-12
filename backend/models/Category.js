import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true
    },
    type: {
      type: String,
      enum: ['product', 'service', 'recharge', 'general'],
      default: 'product'
    },
    description: {
      type: String,
      trim: true
    },
    image: {
      public_id: String,
      url: String
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Category', categorySchema);
