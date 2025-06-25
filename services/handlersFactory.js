import { Model } from 'mongoose';
import { ApiError } from '../utilities/apiErrors.js';
import ApiFeatures from '../utilities/apiFeatures.js';
import qs from 'qs';
import moment from 'moment';

// Delete one document by ID
export const deleteOne = Model => async (req, res, next) => {
  const { id } = req.params;

  const document = await Model.findById(id);
  if (!document) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }

  if (
    req.user.role !== 'admin' &&
    document.user?.toString() !== req.user._id.toString()
  ) {
    return next(
      new ApiError('You are not authorized to delete this document', 403)
    );
  }

  await document.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Document deleted successfully!',
  });
};

// Delete all documents from the collection
export const deleteAll = Model => async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(
      new ApiError('You are not authorized to perform this action', 403)
    );
  }

  const result = await Model.deleteMany();

  if (!result) return next(new ApiError('No document to delete!'));

  res.status(200).json({
    success: true,
    message: 'All documents deleted successfully!',
    deletedCount: result.deletedCount,
  });
};

// Update one document by ID
export const updateOne = Model => async (req, res, next) => {
  const { id } = req.params;

  const document = await Model.findById(id);
  if (!document) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }

  if (
    req.user.role !== 'admin' &&
    document.user?.toString() !== req.user._id.toString()
  ) {
    return next(
      new ApiError('You are not authorized to update this document', 403)
    );
  }

  Object.assign(document, req.body);
  await document.save();

  res.status(200).json({ success: true, data: document });
};

// Create a new document
export const createOne = Model => async (req, res, next) => {
  const document = await Model.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, data: document });
};

// Get one document by ID, restrict to owner if not admin
export const getOne = Model => async (req, res, next) => {
  const { id } = req.params;

  const document = await Model.findById(id);
  if (!document) {
    return next(new ApiError(`No document found for this id: ${id}`, 404));
  }

  if (
    req.user.role !== 'admin' &&
    document.user?.toString() !== req.user._id.toString()
  ) {
    return next(
      new ApiError('You are not authorized to access this document', 403)
    );
  }

  res.status(200).json({ success: true, data: document });
};

// Get all documents with filters, search, pagination, and grouping (for Appointments)
export const getAll = Model => async (req, res, next) => {
  try {
    // Determine the filter based on user role
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };

    // Fetch appointments, populate user info if admin
    const appointments = await Model.find(filter).populate(
      req.user.role === 'admin' ? 'user' : ''
    );

    // Group appointments by date
    const groupedData = {};
    appointments.forEach(appt => {
      const requiredData = {
        _id: appt._id,
        patient: appt.patientName,
        doctor: appt.doctorName,
        startTime: appt.startTime,
        endTime: appt.endTime,
        status: appt.status,
        workToBeDone: appt.workToBeDone,
        prescribedMeds: appt.prescribedMeds,
        notes: appt.notes,
        ...(req.user.role === 'admin' && {
          owner: {
            _id: appt.user._id,
            name: appt.user.name,
            email: appt.user.email,
          },
        }),
      };

      if (!groupedData[appt.date]) {
        groupedData[appt.date] = [];
      }

      groupedData[appt.date].push(requiredData);
    });

    // Sort appointments by time within each date
    for (const date in groupedData) {
      groupedData[date].sort((a, b) =>
        moment(a.startTime, 'HH:mm').diff(moment(b.startTime, 'HH:mm'))
      );
    }

    // Sort dates chronologically
    const sortedGroupedData = Object.fromEntries(
      Object.entries(groupedData).sort(([dateA], [dateB]) =>
        moment(dateA, 'DD-MM-YYYY').diff(moment(dateB, 'DD-MM-YYYY'))
      )
    );

    // Send response
    res.status(200).json({
      success: true,
      data: sortedGroupedData,
    });
  } catch (err) {
    console.error('Error details:', JSON.stringify(err, null, 2));
    return next(new ApiError(err.message, 500));
  }
};
