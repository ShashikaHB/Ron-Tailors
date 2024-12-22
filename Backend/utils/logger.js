import { createLogger, format, transports } from "winston";
import "winston-mongodb";

const mongoDBConnection = process.env.MONGO_DB_URL || "mongodb://localhost:27017/logs"; // Replace with your MongoDB URI

// Define the log format
const logFormat = format.combine(
  format.timestamp(),
  format.json() // Save logs in JSON format
);

const errorConsoleFormat = format.combine(
    format.colorize(),
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  );

// Create the logger
const logger = createLogger({
  level: "info", // Log level
  format: logFormat,
  transports: [
    new transports.Console({
        level: "error", // Only log errors to the console
        format: errorConsoleFormat,
      }),
    new transports.MongoDB({
      db: mongoDBConnection, // MongoDB connection URI
      collection: "RequestLogs", // Collection name for logs
      level: "info", // Minimum log level for this transport
      capped: true, // Create a capped collection for logs
      cappedMax: 1000, // Max number of documents in the collection
    }),
  ],
});

export default logger;