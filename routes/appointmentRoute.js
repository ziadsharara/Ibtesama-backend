import express from 'express';
import {
  getAppointments,
  createAppointment,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  isAvailable,
} from '../services/appointmentsService.js';
import calculateDuration from '../middlewares/calculateDuration.js';

const router = express.Router();

router
  .route('/')
  .get(getAppointments)
  .post(calculateDuration, createAppointment);
router
  .route('/:id')
  .get(getAppointment)
  .patch(updateAppointment)
  .delete(deleteAppointment);
router.route('/is-available').post(isAvailable);

export default router;
