import express from "express";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import materialRouter from "./routes/materialRoutes.js";
import measurementRouter from "./routes/measurementRoutes.js";
import readyMadeItemRouter from "./routes/readyMadeItemRoutes.js";
import customerRouter from "./routes/customerRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import productRouter from "./routes/productRoutes.js";
import connectDB from "./database/dbConnection.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { authMiddleWare } from "./middleware/authMiddleWare.js";
import { logger } from "./middleware/logger.js";
import { corsOptions } from "./config/cors/corsOptions.js";

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

// Auth middleware is used to authenticate the token for each of the following request.
app.use(authMiddleWare);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/material", materialRouter);
app.use("/api/v1/readyMade", readyMadeItemRouter);
app.use("/api/v1/measurement", measurementRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/product", productRouter);

app.get("/", (req, res) => {
  return res.status(200).send("<h1>welcome to node server</h1>");
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Port is defined in .env file
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`server running in ${port}`.bgGreen.red);
});
