import mongoose from 'mongoose';

const workToBeDonoSchema = new mongoose.Schema({
  treatment: String,
  tooth: String,
  estimated_duration: Number, // in minutes
  estimated_cost: Number,
  notes: String,
});

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    date: { type: Date, required: true },
    start_time: { type: String, required: true }, // "09:00"
    end_time: { type: String, required: true }, // "10:00"

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
      default: 'pending',
    },

    chiefComplaint: String,
    diagnosis: String,
    workToBeDone: [workToBeDonoSchema],
    workDone: [workToBeDonoSchema],
    prescribedMeds: [String],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: String,

    // Financial
    totalCost: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    paymentMethod: { type: String, enum: ['cash', 'card', 'transfer'] },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
appointmentSchema.index({ date: 1, doctor: 1 });
appointmentSchema.index({ patient: 1, date: -1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
