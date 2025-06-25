import { Model } from 'mongoose';
import { ApiError } from '../utilities/apiErrors.js';
import ApiFeatures from '../utilities/apiFeatures.js';
import qs from 'qs';
import moment from 'moment';

// Delete one document by ID
export const deleteOne = Model => async (req, res, next) => {
  const { id } = req.params;
  const document = await Model.findByIdAndDelete(id);

  if (!document) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: 'Document deleted successfully!',
  });
};

// Delete all documents from the collection
export const deleteAll = Model => async (req, res, next) => {
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

  const document = await Model.findByIdAndUpdate(id, req.body, {
    new: true, // Return updated document
  });

  if (!document) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }

  res.status(200).json({ success: true, data: document });
};

// Create a new document
export const createOne = Model => async (req, res, next) => {
  const document = await Model.create(req.body);
  res.status(201).json({ success: true, data: document });
};

// Get one document by ID, restrict to owner if not admin
export const getOne = Model => async (req, res, next) => {
  const { id } = req.params;
  const filter = { _id: id };

  // If not admin, restrict to user's own documents
  if (req.user.role !== 'admin') {
    filter.user = req.user._id;
  }

  const document = await Model.findOne(filter);

  if (!document) {
    return next(new ApiError(`No document found for this id: ${id}`, 404));
  }

  res.status(200).json({ success: true, data: document });
};

// Get all documents with filters, search, pagination, and grouping (for Appointments)
export const getAll = Model => async (req, res, next) => {
  try {
    let filter = {};

    // Custom filter (e.g., for nested routes)
    if (req.filterObj) {
      filter = req.filterObj;
    }

    // If user is logged in, filter by user's documents
    if (req.user && req.user._id) {
      filter.user = req.user._id;
    }

    const rawQuery = req._parsedUrl.query;
    const parsedQuery = qs.parse(rawQuery);

    const documentsCount = await Model.countDocuments(filter);

    const apiFeatures = new ApiFeatures(Model.find(filter), parsedQuery)
      .paginate(documentsCount)
      .filter()
      .search('Appointments')
      .limitFields()
      .sort();

    const { mongooseQuery, paginationResult } = apiFeatures;
    const appointments = await mongooseQuery;

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
      };

      if (!groupedData[appt.date]) {
        groupedData[appt.date] = [];
      }

      groupedData[appt.date].push(requiredData);
    });

    // Sort appointments inside each date group by start time
    for (const date in groupedData) {
      groupedData[date].sort((a, b) =>
        moment(a.startTime, 'HH:mm').diff(moment(b.startTime, 'HH:mm'))
      );
    }

    // Sort all date groups ascending
    const sortedGroupedData = Object.fromEntries(
      Object.entries(groupedData).sort(([dateA], [dateB]) =>
        moment(dateA, 'DD-MM-YYYY').diff(moment(dateB, 'DD-MM-YYYY'))
      )
    );

    res.status(200).json({
      success: true,
      paginationResult,
      data: sortedGroupedData,
    });
  } catch (err) {
    console.error('Error details:', JSON.stringify(err, null, 2));
    return next(new ApiError(err.message, 500));
  }
};
