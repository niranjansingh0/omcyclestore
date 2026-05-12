import mongoose from 'mongoose';

const serviceBookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    serviceType: {
      type: String,
      enum: ['mobile-repair', 'mobile-recharge'],
      required: true
    },
    deviceDetails: {
      brand: String,
      model: String,
      serialNumber: String
    },
    issueDescription: String,
    rechargePlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RechargePlan'
    },
    contactPhone: {
      type: String,
      required: true
    },
    serviceAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: {
        type: String,
        default: 'India'
      }
    },
    preferredDate: Date,
    preferredTimeSlot: String,
    estimatedAmount: {
      type: Number,
      default: 0
    },
    finalAmount: {
      type: Number,
      default: 0
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cod', 'cash'],
      default: 'cash'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'in-progress', 'completed', 'cancelled'],
      default: 'requested'
    },
    timeline: [
      {
        status: String,
        note: String,
        updatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

serviceBookingSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('ServiceBooking', serviceBookingSchema);
