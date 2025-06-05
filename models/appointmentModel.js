import mongoose from 'mongoose';

// Create appointment schema
const appointmentSchema = new mongoose.Schema(
  {
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    patientName: String,
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
    },
    doctorName: String,
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    date: Date,
    startTime: String,
    endTime: String,
    status: {
      type: String,
      enum: ['pending', 'inProgress', 'finished', 'cancelled'],
      default: 'pending',
      required: true,
    },
    chiefComplaint: String,
    diagnosis: String,
    workToBeDone: [String],
    workDone: [String],
    prescribedMeds: [String],
    createdById: String,
    notes: [
      {
        note: String,
        createdAt: Date,
      },
    ],
  },
  { timestamps: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
