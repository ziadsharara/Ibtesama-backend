import slugify from 'slugify';
import moment from 'moment';
import Appointment from '../models/appointmentModel.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlersFactory.js';

// @desc    Get list of appointments
// @route   GET /api/appointments
export const getAppointments = getAll(Appointment);

// @desc    Create appointment
// @route   POST /api/appointment
export const createAppointment = createOne(Appointment);

// @desc    Get specific appointment by id
// @route   GET /api/appointment/:id
export const getAppointment = getOne(Appointment);

// @desc    Update appointment
// @route   PATCH /api/appointment/:id
export const updateAppointment = updateOne(Appointment);

// @desc    delete appointment
// @route   DELETE /api/appointment/:id
export const deleteAppointment = deleteOne(Appointment);

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
