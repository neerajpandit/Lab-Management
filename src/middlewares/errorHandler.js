// Cerntralized error handling
import { ApiError } from './ApiError.js';

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    // Custom error handling for ApiError
    return res.status(err.statusCode || 500).json({
      status: err.statusCode,
      message: err.message,
      error: err.message,
    });
  }

  // If it's not an ApiError, return a generic server error
  console.error(err); // Log internal errors
  return res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    error: err.message || 'Internal server error',
  });
};



export default errorHandler;
