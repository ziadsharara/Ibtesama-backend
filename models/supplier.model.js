import mongoose from 'mongoose';
import { phoneSchema, addressSchema } from './user.model.js';

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phones: [phoneSchema],
    emails: [String],
    address: addressSchema,

    // Relations
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InventoryOrder' }],

    // Financial tracking
    totalOwed: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },

    notes: String,
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Virtual for active orders count
supplierSchema.virtual('noOfActiveOrders').get(function () {
  // This will be calculated when needed
  return 0;
});

supplierSchema.virtual('latePayments').get(function () {
  return this.totalOwed > 0;
});

const Supplier = mongoose.model('Supplier', supplierSchema);
export default Supplier;
