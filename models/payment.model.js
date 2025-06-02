import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },

    category: {
      type: String,
      enum: ['patient', 'doctor', 'lab', 'supplier', 'other'],
      required: true,
    },

    // References based on category
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab' },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },

    // Related entities
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    labOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'LabOrder' },
    inventoryOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InventoryOrder',
    },

    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ['cash', 'card', 'transfer', 'check'],
      default: 'cash',
    },

    date: { type: Date, default: Date.now },
    notes: String,

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for financial reports
paymentSchema.index({ date: -1, category: 1 });
paymentSchema.index({ type: 1, category: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
