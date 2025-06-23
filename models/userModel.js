import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
    profileImg: String,
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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export const User = mongoose.model('User', userSchema);
