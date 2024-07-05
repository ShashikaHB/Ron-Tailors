import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import * as dotenv from "dotenv";

dotenv.config();

export const authMiddleWare = asyncHandler(async (req, res, next) => {
  // Extract header
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    throw new Error("UnAuthorized Request");
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`, (err, decoded) => {
    if (err) {
      res.statusCode = err.name === "TokenExpiredError" ? 403 : 401;
      throw new Error(`${err.message}`);
    }
    req.userId = decoded.userId;
    next();
  });
});
