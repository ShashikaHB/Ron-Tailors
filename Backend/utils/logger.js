import { createLogger, format, transports } from "winston";
import "winston-mongodb";

// const mongoDBConnection = process.env.MONGO_DB_TEST_URL || "mongodb://localhost:27017/logs"; // Replace with your MongoDB URI

const dbUri = `${process.env.MONGO_DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

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
      db: dbUri, // MongoDB connection URI
      collection: "RequestLogs", // Collection name for logs
      level: "info", // Minimum log level for this transport
      capped: true, // Create a capped collection for logs
      cappedMax: 1000, // Max number of documents in the collection
      bufferMaxEntries: 100, // Maximum number of log entries to buffer

    }),
  ],
});

const fallbackLogs = [];

logger.on("error", (error) => {
  fallbackLogs.push({ level: "info", message: "Failed log entry" });
  console.error("Logging error:", error.message);
});

// Retry logic (example):
setInterval(async () => {
  if (fallbackLogs.length > 0) {
    try {
      for (const log of fallbackLogs) {
        logger.log(log); // Retry the log
      }
      fallbackLogs.length = 0; // Clear successfully logged entries
    } catch (error) {
      console.error("Retry failed:", error.message);
    }
  }
}, 5000); // Retry every 5 seconds

export default logger;