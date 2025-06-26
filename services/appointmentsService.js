import slugify from 'slugify';
import moment from 'moment';
import { DateTime } from 'luxon';
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
export const createAppointment = async (req, res) => {
  const { date, startTime, endTime } = req.body;

  let startTimeUTC = null;
  let endTimeUTC = null;

  if (startTime) {
    const startTimeString = `${date}T${startTime}`;
    const startTimeDate = DateTime.fromISO(startTimeString, {
      zone: 'Africa/Cairo',
    });

    if (!startTimeDate.isValid) {
      return res.status(400).json({ error: 'Invalid start time' });
    }

    startTimeUTC = startTimeDate.toUTC().toJSDate();
  }

  if (endTime) {
    const endTimeString = `${date}T${endTime}`;
    const endTimeDate = DateTime.fromISO(endTimeString, {
      zone: 'Africa/Cairo',
    });

    if (!endTimeDate.isValid) {
      return res.status(400).json({ error: 'Invalid end time' });
    }

    endTimeUTC = endTimeDate.toUTC().toJSDate();
  }

  req.body.startTimeUTC = startTimeUTC;
  req.body.endTimeUTC = endTimeUTC;

  const appointment = await Appointment.create(req.body);

  res.status(201).json({ success: true, data: appointment });
};

// @desc    Get specific appointment by id
// @route   GET /api/appointment/:id
export const getAppointment = getOne(Appointment);

// @desc    Update appointment
// @route   PATCH /api/appointment/:id
export const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime, ...otherFields } = req.body;

    let startTimeUTC = null;
    let endTimeUTC = null;

    if (startTime) {
      const startTimeString = `${date}T${startTime}`;
      const startTimeDate = DateTime.fromISO(startTimeString, {
        zone: 'Africa/Cairo',
      });
      if (!startTimeDate.isValid) {
        return res.status(400).json({ error: 'Invalid start time' });
      }
      startTimeUTC = startTimeDate.toUTC().toJSDate();
    }

    if (endTime) {
      const endTimeString = `${date}T${endTime}`;
      const endTimeDate = DateTime.fromISO(endTimeString, {
        zone: 'Africa/Cairo',
      });
      if (!endTimeDate.isValid) {
        return res.status(400).json({ error: 'Invalid end time' });
      }
      endTimeUTC = endTimeDate.toUTC().toJSDate();
    }

    if (
      startTimeUTC &&
      endTimeUTC &&
      startTimeUTC.getTime() === endTimeUTC.getTime()
    ) {
      return res
        .status(400)
        .json({ error: 'Start time and end time cannot be the same.' });
    }

    const updatedBody = {
      ...otherFields,
      date,
      startTime,
      endTime,
      startTimeUTC,
      endTimeUTC,
    };

    const document = await Appointment.findByIdAndUpdate(id, updatedBody, {
      new: true,
    });

    if (!document) {
      return next(new ApiError(`No appointment found for id ${id}`, 404));
    }

    res.status(200).json({ success: true, data: document });
  } catch (error) {
    next(new ApiError(`Error updating appointment: ${error.message}`, 500));
  }
};

// @desc    delete appointment
// @route   DELETE /api/appointment/:id
export const deleteAppointment = deleteOne(Appointment);

// @desc    Check if time slot is available
// @route   POST /api/appointment/is-available
export const isAvailable = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;

    if (!date || !startTime) {
      return res
        .status(400)
        .json({ error: 'Date and start time are required.' });
    }

    const zone = 'Africa/Cairo';
    const startTimeUTC = DateTime.fromISO(`${date}T${startTime}`, { zone })
      .startOf('minute')
      .toUTC()
      .toJSDate();

    if (!startTimeUTC) {
      return res.status(400).json({ error: 'Invalid start time.' });
    }

    console.log('Start Time UTC:', startTimeUTC);

    if (!endTime) {
      const conflict = await Appointment.findOne({
        $or: [
          {
            startTimeUTC: { $lte: startTimeUTC },
            endTimeUTC: { $gt: startTimeUTC },
          },
          {
            startTimeUTC: startTimeUTC,
            endTimeUTC: null,
          },
        ],
      });

      return res.status(200).json({
        conflict: !!conflict,
        ...(conflict && {
          error: 'Start time falls within an existing appointment.',
        }),
      });
    }

    if (startTime === endTime) {
      return res.status(200).json({
        conflict: true,
        error: 'Start time and end time are the same!',
      });
    }

    let endTimeDate = DateTime.fromISO(`${date}T${endTime}`, { zone });

    if (!endTimeDate.isValid) {
      return res.status(400).json({ error: 'Invalid end time.' });
    }

    if (endTimeDate <= DateTime.fromJSDate(startTimeUTC).setZone(zone)) {
      endTimeDate = endTimeDate.plus({ days: 1 });
    }

    const endTimeUTC = endTimeDate.startOf('minute').toUTC().toJSDate();

    const conflict = await Appointment.findOne({
      $or: [
        {
          startTimeUTC: { $lt: endTimeUTC },
          endTimeUTC: { $gt: startTimeUTC },
        },
        {
          startTimeUTC: startTimeUTC,
          endTimeUTC: null,
        },
      ],
    });

    return res.status(200).json({
      conflict: !!conflict,
      ...(conflict && {
        error: 'Time range overlaps with another appointment.',
      }),
    });
  } catch (err) {
    console.error('checkConflict error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
};
