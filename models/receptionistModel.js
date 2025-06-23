import mongoose from 'mongoose';
import { User } from './userModel.js';

const receptionistSchema = new mongoose.Schema({
  labOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LabOrder' }],
  inventoryOrders: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryOrder' },
  ],
});

export const Receptionist = User.discriminator(
  'Receptionist',
  receptionistSchema
);
