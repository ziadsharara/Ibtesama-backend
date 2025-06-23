import mongoose from 'mongoose';

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

    password: {
      type: String,
      required: [true, 'password required!'],
      minlength: [6, 'Too short password'],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,

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
      enum: ['admin', 'doctor', 'receptionist', 'patient'],
      required: true,
    },
    salary: {
      amount: Number,
      currency: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
