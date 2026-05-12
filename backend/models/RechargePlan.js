import mongoose from 'mongoose';

const rechargePlanSchema = new mongoose.Schema(
  {
    operator: {
      type: String,
      required: true,
      trim: true
    },
    circle: {
      type: String,
      required: true,
      trim: true
    },
    planName: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    validity: {
      type: String,
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    benefits: [String],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

rechargePlanSchema.index({ operator: 1, circle: 1, amount: 1 });

export default mongoose.model('RechargePlan', rechargePlanSchema);
