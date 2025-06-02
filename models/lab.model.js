import mongoose from 'mongoose';
import { phoneSchema, addressSchema } from './user.model.js';

const labSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phones: [phoneSchema],
    emails: [String],
    address: addressSchema,

    specialities: [String], // ["Crowns", "Orthodontics", "Implants"]
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LabOrder' }],

    // Financial tracking
    totalOwed: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Virtual for active orders count
labSchema.virtual('noOfActiveOrders').get(function () {
  // This will be calculated when needed
  return 0;
});

labSchema.virtual('latePayments').get(function () {
  return this.totalOwed > 0;
});

const Lab = mongoose.model('Lab', labSchema);
export default Lab;
