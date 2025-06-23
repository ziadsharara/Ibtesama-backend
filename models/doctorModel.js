import mongoose from 'mongoose';
import { User } from './userModel.js';

const doctorSchema = new mongoose.Schema({
  specialties: [String],
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
  labOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LabOrder' }],
});

export const Doctor = User.discriminator('Doctor', doctorSchema);
