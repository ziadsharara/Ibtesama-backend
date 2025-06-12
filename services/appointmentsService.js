import slugify from 'slugify';
import moment from 'moment';
import Appointment from '../models/appointmentModel.js';
import { ApiError } from '../utilities/apiErrors.js';

// @desc    Get list of appointments
// @route   GET /api/appointments
export const getAppointments = async (req, res) => {
  const appointments = await Appointment.find({});
  res.status(200).json({
    success: true,
    data: appointments,
  });
};

// @desc    Create appointment
// @route   POST /api/appointment
export const createAppointment = async (req, res) => {
  const {
    // Changed patient and doctor to patientName and doctorName for now.
    patientName,
    doctorName,
    date,
    startTime,
    endTime,
    status,
    chiefComplaint,
    diagnosis,
    workToBeDone,
    workDone,
    prescribedMeds,
    notes,
  } = req.body;

  // Auto calculate duration
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  // Changed this to support appointments crossing midnight.
  const start = startHour * 60 + startMin;
  const end = endHour * 60 + endMin;
  const duration = end >= start ? end - start : 1440 - start + end;

  // ChatGPT recommended using await here.
  const appointment = await Appointment.create({
    // Changed patient and doctor to patientName and doctorName for now.
    patientName,
    doctorName,
    date,
    startTime,
    endTime,
    duration,
    status,
    chiefComplaint,
    diagnosis,
    workToBeDone,
    workDone,
    prescribedMeds,
    notes,
  });
  res.status(201).json({ success: true, data: appointment });
};

// @desc    Get specific appointment by id
// @route   GET /api/appointment/:id
export const getAppointment = async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    // ApiError('message', statusCode)
    return next(new ApiError(`No appointment for this id ${id}`, 404));
  }
  res.status(200).json({ success: true, data: appointment });
};

// @desc    Update appointment
// @route   PATCH /api/appointment/:id
export const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const {
    patient,
    doctor,
    date,
    startTime,
    endTime,
    status,
    chiefComplaint,
    diagnosis,
    workToBeDone,
    workDone,
    prescribedMeds,
    notes,
  } = req.body;

  const appointment = await Appointment.findOneAndUpdate(
    { _id: id },
    {
      patient,
      doctor,
      startTime,
      endTime,
      status,
      chiefComplaint,
      diagnosis,
      workToBeDone,
      workDone,
      prescribedMeds,
      notes,
    },
    { new: true } // to return the data after update in response
  );

  if (!appointment) {
    return next(new ApiError(`No appointment for this id ${id}`, 404));
  }
  res.status(200).json({ success: true, data: appointment });
};

// @desc    delete appointment
// @route   DELETE /api/appointment/:id
export const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findByIdAndDelete(id);

  if (!appointment) {
    return next(new ApiError(`No appointment for this id ${id}`, 404));
  }
  res
    .status(200)
    .json({ success: true, message: 'Appointment deleted successfully!' });
};

// @desc    Check if time slot is available
// @route   POST /api/appointment/is-available
export const isAvailable = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;

    if (!startTime || !endTime) {
      return res
        .status(400)
        .json({ message: 'Start and end times are required.' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: 'Invalid date format.' });
    }

    if (start >= end) {
      return res
        .status(400)
        .json({ message: 'Start time must be before end time.' });
    }

    const overlapping = await Appointment.findOne({
      $or: [
        {
          startTime: { $lt: end },
          endTime: { $gt: start },
        },
      ],
    });

    return res.json({ available: !overlapping });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};
