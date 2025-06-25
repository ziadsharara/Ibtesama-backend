import mongoose from 'mongoose';
import { ApiError } from '../utilities/apiErrors.js';
import Patient from './patientModel.js';

// Create appointment schema
const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    patientName: String,
    doctorName: String,
    date: String,
    startTime: String,
    endTime: String,
    startTimeUTC: { type: Date, default: null },
    endTimeUTC: { type: Date, default: null },
    status: {
      type: String,
      enum: ['Pending', 'Finished', 'Cancelled'],
      default: 'Pending',
    },
    chiefComplaint: [String],
    diagnosis: [String],
    workToBeDone: [String],
    workDone: [String],
    prescribedMeds: [String],
    notes: [String],
  },
  { timestamps: true }
);

// async function syncWorkDoneWithTreatmentHistory(appointment) {
//   if (!appointment.patientId) return;

//   const patient = await Patient.findById(appointment.patientId);
//   if (!patient) return;

//   patient.treatmentHistory = patient.treatmentHistory.filter(t => {
//     return (
//       new Date(t.date).toDateString() !==
//       new Date(appointment.date).toDateString()
//     );
//   });

//   appointment.workDone.forEach(work => {
//     patient.treatmentHistory.push({
//       treatment: work,
//       date: appointment.date.toISOString().split('T')[0],
//     });
//   });

//   await patient.save();
// }

// appointmentSchema.post('save', async function (doc) {
//   try {
//     await syncWorkDoneWithTreatmentHistory(doc);
//   } catch (err) {
//     console.error('Error syncing treatmentHistory after save:', err);
//   }
// });

// appointmentSchema.post('findOneAndUpdate', async function (doc) {
//   try {
//     if (doc) {
//       await syncWorkDoneWithTreatmentHistory(doc);
//     }
//   } catch (err) {
//     console.error(
//       'Error syncing treatmentHistory after findOneAndUpdate:',
//       err
//     );
//   }
// });

// appointmentSchema.post('findOneAndDelete', async function (doc) {
//   try {
//     if (!doc) return;
//     const patient = await Patient.findById(doc.patientId);
//     if (!patient) return;

//     patient.treatmentHistory = patient.treatmentHistory.filter(
//       t => new Date(t.date).toDateString() !== new Date(doc.date).toDateString()
//     );

//     await patient.save();
//   } catch (err) {
//     throw new ApiError(err.message, 500);
//   }
// });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
