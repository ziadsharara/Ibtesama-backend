import { Model } from 'mongoose';
import { ApiError } from '../utilities/apiErrors.js';
import ApiFeatures from '../utilities/apiFeatures.js';
import qs from 'qs';
import moment from 'moment';

export const deleteOne = Model => async (req, res, next) => {
  const { id } = req.params;
  const document = await Model.findByIdAndDelete(id);

  if (!document) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }
  res
    .status(200)
    .json({ success: true, message: 'Document deleted successfully!' });
};

export const deleteAll = Model => async (req, res, next) => {
  const result = await Model.deleteMany();

  if (!result) return next(new ApiError('No document to delete!'));

  res.status(200).json({
    success: true,
    message: `All documents deleted successfully!`,
    deletedCount: result.deletedCount,
  });
};

export const updateOne = Model => async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const document = await Model.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } // to return the data after update in response
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: document });
};

export const createOne = Model => async (req, res) => {
  const document = await Model.create(req.body);
  res.status(201).json({ success: true, data: document });
};

export const getOne = Model => async (req, res, next) => {
  const { id } = req.params;
  const document = await Model.findById(id);
  if (!document) {
    // ApiError('message', statusCode)
    return next(new ApiError(`No document for this id ${id}`, 404));
  }
  res.status(200).json({ success: true, data: document });
};

export const getAll = Model => async (req, res, next) => {
  try {
    let filter = {};
    const today = moment().format('DD-MM-YYYY');

    if (req.filterObj) {
      filter = req.filterObj;
    }

    // filter.date = today;

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

    // Group by date
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

    // Sort appointments inside each date group by startTime
    for (const date in groupedData) {
      groupedData[date].sort((a, b) =>
        moment(a.startTime, 'HH:mm').diff(moment(b.startTime, 'HH:mm'))
      );
    }

    // Sort dates ascending
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
