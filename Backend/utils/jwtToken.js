import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export const generateAccessToken = (id) => {
  return jwt.sign({ userId: id }, `${process.env.ACCESS_TOKEN_SECRET}`, {
    expiresIn: "2m",
  });
};
export const generateRefreshToken = (id) => {
  return jwt.sign({ userId: id }, `${process.env.REFRESH_TOKEN_SECRET}`, {
    expiresIn: "5m",
  });
};

export const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, `${process.env.REFRESH_TOKEN_SECRET}`, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};
