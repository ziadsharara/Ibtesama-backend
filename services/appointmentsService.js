import slugify from 'slugify';
import Appointment from '../models/appointmentModel.js';

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
  } = req.body;

  // Auto calculate duration
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const duration = endHour * 60 + endMin - (startHour * 60 + startMin);

  const appointment = Appointment.create({
    patient,
    doctor,
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
    return res.status(404).json({
      success: false,
      message: `There is no user with this id: ${id}`,
    });
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
    return res.status(404).json({
      success: false,
      message: `There is no user with this id: ${id}`,
    });
  }
  res.status(200).json({ success: true, data: appointment });
};

// @desc    delete appointment
// @route   DELETE /api/appointment/:id
export const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findByIdAndDelete(id);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: `There is no user with this id: ${id}`,
    });
  }
  res
    .status(200)
    .json({ success: true, message: 'Appointment deleted successfully!' });
};
