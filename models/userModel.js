import mongoose from 'mongoose';

// Create user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      firstName: {
        type: String,
        required: [true, 'First Name Required!'],
        minlength: [3, 'Too short name!'],
        maxlength: [20, 'Too long '],
      },
      lastName: {
        type: String,
        required: [true, 'Last Name Required!'],
        minlength: [3, 'Too short name!'],
        maxlength: [20, 'Too long '],
      },
    },
    email: String,
    phone: {
      number: String,
      calls: Boolean,
      whatsapp: Boolean,
    },
    address: {
      address: String,
      city: String,
      government: String,
      country: String,
    },
    role: {
      type: String,
      enum: ['admin', 'doctor', 'receptionist'],
      required: true,
    },
    salary: {
      amount: Number,
      currency: String,
    },
  },
  { timestamps: true }
);

// Create user model
export const User = mongoose.model('User', userSchema);

// Create doctor schema
const doctorSchema = new mongoose.Schema({
  specialties: [String],
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
  labOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LabOrder' }],
});

// Create doctor model
export const Doctor = User.discriminator('Doctor', doctorSchema);

// Create receptionist schema
const receptionistSchema = new mongoose.Schema({
  labOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LabOrder' }],
  inventoryOrders: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryOrder' },
  ],
});

// Create receptionist model
export const Receptionist = User.discriminator(
  'Receptionist',
  receptionistSchema
);
