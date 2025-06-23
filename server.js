import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors'; // 👈 Import cors
import dbConnection from './config/database.js';
import { ApiError } from './utilities/apiErrors.js';
import { globalError } from './middlewares/errorMiddleware.js';
import appointmentRoute from './routes/appointmentRoute.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';

dotenv.config({ path: 'config.env' });

// Connect with db
dbConnection();

// Express app
const app = express();

// Middlewares
app.use(express.json());

// 👇 Add CORS middleware BEFORE your routes
app.use(
  cors({
    origin: 'http://localhost:5173', // frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true, // if you're using cookies/auth headers
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use('/api/appointment', appointmentRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/auth', authRoute);

// Generate error for undefined routes
app.use((req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware
app.use(globalError);

const PORT = process.env.PORT || 9000;
const server = app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`)
);

// Handling unhandled promise rejections
process.on('unhandledRejection', err => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down...`);
    process.exit(1);
  });
});
