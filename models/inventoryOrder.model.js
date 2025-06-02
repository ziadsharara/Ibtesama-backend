import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  supply: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supply',
    required: true,
  },
  name: String, // Cache supply name for historical records
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const inventoryOrderSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    type: {
      type: String,
      enum: ['restock', 'return'],
      default: 'restock',
    },

    status: {
      type: String,
      enum: ['pending', 'ordered', 'delivered', 'cancelled'],
      default: 'pending',
    },

    items: [orderItemSchema],

    totalPrice: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },

    addedAt: { type: Date, default: Date.now },
    orderedAt: Date,
    expectedDeliveryAt: Date,
    deliveredAt: Date,

    notes: String,
  },
  {
    timestamps: true,
  }
);

// Calculate total price before saving
inventoryOrderSchema.pre('save', function (next) {
  this.totalPrice = this.items.reduce(
    (total, item) => total + item.totalPrice,
    0
  );
  next();
});

const InventoryOrder = mongoose.model('InventoryOrder', inventoryOrderSchema);
export default InventoryOrder;
