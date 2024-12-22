import logger from "../utils/logger.js";

export const errorConstants = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// Not Found Handler
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error Handler

export const errorHandler = (err, req, res, next) => {
   // Log the error with Winston
   logger.error({
    message: err.message,
    name: err.name,
    stack: err.stack, // Include the stack trace for debugging
    method: req.method,
    url: req.originalUrl,
    origin: req.headers.origin || "unknown",
  });

  const statuscode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statuscode);
  res.json({
    message: err.message,
    stack: err.stack,
  });
};
