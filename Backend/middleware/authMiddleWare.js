import User from "../models/userModel";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const authMiddleWare = asyncHandler(async(req, res, next));
