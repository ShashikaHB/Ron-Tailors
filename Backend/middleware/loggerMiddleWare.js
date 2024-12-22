import logger from "../utils/logger.js";

const requestLogger = (req, res, next) => {
  const logEntry = {
    method: req.method,
    url: req.originalUrl,
    body: JSON.stringify(req.body, null, 2), // Stringify entire request body
    params: req.params, // URL parameters
    query: req.query, // Query string parameters
    headers: req.headers, // Headers (optional)
  };

  logger.info(logEntry); // Log the request
  next(); // Proceed to the next middleware
};

export default requestLogger;
