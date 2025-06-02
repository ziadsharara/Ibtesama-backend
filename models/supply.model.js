import mongoose from 'mongoose';

const priceHistorySchema = new mongoose.Schema({
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  price: Number,
  date: { type: Date, default: Date.now },
});

const supplySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: String, // "Instruments", "Materials", "Consumables"
    quantity: { type: Number, default: 0 },
    unit: { type: String, default: 'piece' }, // "piece", "box", "liter", etc.

    thresholdQuantity: { type: Number, default: 10 }, // Minimum stock level

    lastPurchased: Date,
    avgPrice: { type: Number, default: 0 },
    priceHistory: [priceHistorySchema],

    notes: String,
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Virtual to check if supply is low
supplySchema.virtual('isLowStock').get(function () {
  return this.quantity <= this.thresholdQuantity;
});

const Supply = mongoose.model('Supply', supplySchema);
export default Supply;
