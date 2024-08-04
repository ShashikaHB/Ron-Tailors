import express from "express";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import materialRouter from "./routes/materialRoutes.js";
import rentItemRouter from "./routes/rentItemRoutes.js";
import measurementRouter from "./routes/measurementRoutes.js";
import readyMadeItemRouter from "./routes/readyMadeItemRoutes.js";
import customerRouter from "./routes/customerRoutes.js";
import salesOrderRoutes from "./routes/salesOrderRoutes.js";
import rentOrderRoutes from "./routes/rentOrderRoutes.js";
import productRouter from "./routes/productRoutes.js";
import invoiceRouter from "./routes/invoiceRoutes.js";
import connectDB from "./database/dbConnection.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { authMiddleWare } from "./middleware/authMiddleWare.js";
import { logger } from "./middleware/logger.js";
import { corsOptions } from "./config/cors/corsOptions.js";
import { sendSMS } from "./notificationSMS/smsNotification.js";

// Initialize app instance
const app = express();

// dot env configuration
dotenv.config();

// DB connection
connectDB();

// Initialize logger instance
app.use(logger);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser()); // This is used to add the refresh token to http only cookie
app.use(bodyParser.urlencoded({ extended: false }));

// Routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/invoice", invoiceRouter);

// Auth middleware is used to authenticate the token for each of the following request.
app.use(authMiddleWare);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/material", materialRouter);
app.use("/api/v1/rentItem", rentItemRouter);
app.use("/api/v1/readyMade", readyMadeItemRouter);
app.use("/api/v1/measurement", measurementRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/salesOrder", salesOrderRoutes);
app.use("/api/v1/rentOrder", rentOrderRoutes);
app.use("/api/v1/product", productRouter);

app.get("/", (req, res) => {
  return res.status(200).send("<h1>welcome to node server</h1>");
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// sendSMS("hello from nodejs", "+94713116161")
//   .then((body) => console.log(body))
//   .catch((error) => console.log(error));

// Port is defined in .env file
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`server running in ${port}`.bgGreen.red);
});
