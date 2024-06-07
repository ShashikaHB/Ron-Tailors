import express from "express";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import materialRouter from "./routes/materialRoutes.js";
import readyMadeItemRouter from "./routes/readyMadeItemRoutes.js";
import customerRouter from "./routes/customerRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import productRouter from "./routes/productRoutes.js";
import connectDB from "./database/dbConnection.js";
import bodyParser from "body-parser";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

// dot env configuration
dotenv.config();

// db connection
connectDB();

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

//routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/material", materialRouter);
app.use("/api/v1/readyMade", readyMadeItemRouter);
app.use("/api/v1/material", materialRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/product", productRouter);

app.get("/", (req, res) => {
  return res.status(200).send("<h1>welcome to node server</h1>");
});

//error handling middleware
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`server running in ${port}`.bgGreen.black);
});
