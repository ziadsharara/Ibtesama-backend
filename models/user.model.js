import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const phoneSchema = new mongoose.Schema({
  number: { type: String, required: true },
  calls: { type: Boolean, default: true },
  whatsapp: { type: Boolean, default: false },
});

const addressSchema = new mongoose.Schema({
  address: String,
  city: String,
  government: String,
  country: { type: String, default: 'Egypt' },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: String,
    phones: [phoneSchema],
    address: addressSchema,
    role: {
      type: String,
      enum: ['admin', 'doctor', 'receptionist'],
      required: true,
    },
    salary: Number,

    // Doctor specific fields
    speciality: String,
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],

    // Relations
    labOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LabOrder' }],
    inventoryOrders: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryOrder' },
    ],

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export { phoneSchema, addressSchema };
export default User;
