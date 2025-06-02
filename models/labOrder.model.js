import mongoose from 'mongoose';

const labOrderSchema = new mongoose.Schema(
  {
    lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    type: { type: String, required: true }, // "Crown", "Bridge", "Denture", etc.

    status: {
      type: String,
      enum: [
        'pending',
        'received_by_lab',
        'in_progress',
        'delivered_by_lab',
        'cancelled',
      ],
      default: 'pending',
    },

    orderedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    addedAt: { type: Date, default: Date.now },
    orderedAt: Date,
    expectedDeliveryAt: Date,
    deliveredAt: Date,

    price: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },

    notes: String,

    // File attachments (prescriptions, photos, etc.)
    attachments: [
      {
        url: String,
        type: String, // "prescription", "photo", "scan"
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
labOrderSchema.index({ lab: 1, status: 1 });
labOrderSchema.index({ patient: 1, addedAt: -1 });

const LabOrder = mongoose.model('LabOrder', labOrderSchema);
export default LabOrder;
