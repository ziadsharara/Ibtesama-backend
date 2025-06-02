import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan'; // HTTP request logger middleware
import dbConnection from './config/database.js';
import { ApiError } from './utils/apiError.js';
import { globalError } from './middlewares/errorMiddleware.js';

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

// Generate error handling middleware for express
app.use((req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware
app.use(globalError);

const PORT = process.env.PORT || 9000;
const server = app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`)
);

// Handling rejections outside express
process.on('unhandledRejection', err => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  // finish all processes on the server and exit from app
  server.close(() => {
    console.error(`Shutting down...`);
    process.exit(1);
  });
});
