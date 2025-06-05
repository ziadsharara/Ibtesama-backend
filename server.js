import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan'; // HTTP request logger middleware
import dbConnection from './config/database.js';
import appointmentRoute from './routes/appointmentRoute.js';

dotenv.config({ path: 'config.env' }); // Setting the .env variables

// Connect with db
dbConnection();

// Express app
const app = express();

// Middlewares
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use('/api/appointment', appointmentRoute);

const PORT = process.env.PORT || 9000;
const server = app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`)
);
