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
    notes: [
      {
        note: String,
        // author: { id: String, role: String },
        createdAt: Date,
        updatedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

async function syncWorkDoneWithTreatmentHistory(appointment) {
  if (!appointment.patientId) return;

  const patient = await Patient.findById(appointment.patientId);
  if (!patient) return;

  patient.treatmentHistory = patient.treatmentHistory.filter(t => {
    return (
      new Date(t.date).toDateString() !==
      new Date(appointment.date).toDateString()
    );
  });

  appointment.workDone.forEach(work => {
    patient.treatmentHistory.push({
      treatment: work,
      date: appointment.date.toISOString().split('T')[0],
    });
  });

  await patient.save();
}

appointmentSchema.post('save', async function (doc) {
  try {
    await syncWorkDoneWithTreatmentHistory(doc);
  } catch (err) {
    console.error('Error syncing treatmentHistory after save:', err);
  }
});

appointmentSchema.post('findOneAndUpdate', async function (doc) {
  try {
    if (doc) {
      await syncWorkDoneWithTreatmentHistory(doc);
    }
  } catch (err) {
    console.error(
      'Error syncing treatmentHistory after findOneAndUpdate:',
      err
    );
  }
});

appointmentSchema.post('findOneAndDelete', async function (doc) {
  try {
    if (!doc) return;
    const patient = await Patient.findById(doc.patientId);
    if (!patient) return;

    patient.treatmentHistory = patient.treatmentHistory.filter(
      t => new Date(t.date).toDateString() !== new Date(doc.date).toDateString()
    );

    await patient.save();
  } catch (err) {
    console.error(
      'Error syncing treatmentHistory after findOneAndDelete:',
      err
    );
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
