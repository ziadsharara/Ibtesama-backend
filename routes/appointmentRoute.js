import express from 'express';
import {
  getAppointments,
  createAppointment,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  isAvailable,
} from '../services/appointmentsService.js';
import * as authService from '../services/authService.js';

const router = express.Router();

router.route('/').get(getAppointments).post(createAppointment);
router
  .route('/:id')
  .get(authService.protect, authService.allowedTo('admin'), getAppointment)
  .patch(authService.protect, authService.allowedTo('admin'), updateAppointment)
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteAppointment
  );
router
  .route('/is-available')
  .post(authService.protect, authService.allowedTo('admin'), isAvailable);

export default router;
