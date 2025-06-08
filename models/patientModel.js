import mongoose from 'mongoose';
import moment from 'moment';

const patientSchema = mongoose.Schema(
  {
    name: {
      firstName: String,
      lastName: String,
    },
    birthdate: {
      type: Date,
      required: true,
      get: date => moment(date).format('DD/MM/YYYY'),
    },
    sex: {
      type: String,
      enum: ['male', 'female'],
    },
    phones: [
      {
        number: String,
        calls: Boolean,
        whatsapp: Boolean,
      },
    ],
    emails: [String],
    address: {
      address: String,
      city: String,
      government: String,
      country: String,
    },
    medicalHistory: [
      {
        condition: String,
        notes: {
          type: String,
          required: false,
        },
      },
    ],
    medications: [String],
    treatmentHistory: [
      {
        treatment: String,
        date: String,
      },
    ],
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
      },
    ],
    ///////////////
    chart: {
      type: Map,
      of: [
        {
          date: Date,
          treatment: String,
          doctor: String,
        },
      ],
      default: {},
    },
    xrays: [
      {
        id: String,
        url: String,
        date: Date,
        notes: String,
      },
    ],
    ///////////////
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

// Virtual field: calculate age from birthdate
patientSchema.virtual('age').get(function () {
  if (!this.birthdate) return null;
  return moment().diff(this.birthdate, 'years');
});

// Ensure virtuals and getters appear in JSON output
patientSchema.set('toJSON', {
  virtuals: true,
  getters: true,
});
patientSchema.set('toObject', {
  virtuals: true,
  getters: true,
});

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
