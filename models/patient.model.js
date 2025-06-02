import mongoose from 'mongoose';
import { phoneSchema, addressSchema } from './user.model.js';

const medicalHistorySchema = new mongoose.Schema({
  condition: String,
  notes: String,
  date: { type: Date, default: Date.now },
});

const treatmentSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  treatment: String,
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String,
  cost: Number,
});

const chartSchema = new mongoose.Schema({
  tooth01: [treatmentSchema],
  tooth02: [treatmentSchema],
  tooth03: [treatmentSchema],
  tooth04: [treatmentSchema],
  tooth05: [treatmentSchema],
  tooth06: [treatmentSchema],
  tooth07: [treatmentSchema],
  tooth08: [treatmentSchema],
  tooth11: [treatmentSchema],
  tooth12: [treatmentSchema],
  tooth13: [treatmentSchema],
  tooth14: [treatmentSchema],
  tooth15: [treatmentSchema],
  tooth16: [treatmentSchema],
  tooth17: [treatmentSchema],
  tooth18: [treatmentSchema],
  tooth21: [treatmentSchema],
  tooth22: [treatmentSchema],
  tooth23: [treatmentSchema],
  tooth24: [treatmentSchema],
  tooth25: [treatmentSchema],
  tooth26: [treatmentSchema],
  tooth27: [treatmentSchema],
  tooth28: [treatmentSchema],
  tooth31: [treatmentSchema],
  tooth32: [treatmentSchema],
  tooth33: [treatmentSchema],
  tooth34: [treatmentSchema],
  tooth35: [treatmentSchema],
  tooth36: [treatmentSchema],
  tooth37: [treatmentSchema],
  tooth38: [treatmentSchema],
  tooth41: [treatmentSchema],
  tooth42: [treatmentSchema],
  tooth43: [treatmentSchema],
  tooth44: [treatmentSchema],
  tooth45: [treatmentSchema],
  tooth46: [treatmentSchema],
  tooth47: [treatmentSchema],
  tooth48: [treatmentSchema],
});

const xraySchema = new mongoose.Schema({
  url: String,
  date: { type: Date, default: Date.now },
  notes: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    birthdate: Date,
    sex: { type: String, enum: ['male', 'female'] },
    phones: [phoneSchema],
    emails: [String],
    address: addressSchema,

    medicalHistory: [medicalHistorySchema],
    medications: [String],
    treatmentHistory: [treatmentSchema],

    // Relations
    appointments: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    ],
    chart: chartSchema,
    xrays: [xraySchema],

    // Financial
    totalOwed: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Virtual for last and next appointments
patientSchema.virtual('lastAppointment').get(function () {
  // This will be populated when needed
  return null;
});

patientSchema.virtual('nextAppointment').get(function () {
  // This will be populated when needed
  return null;
});

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
