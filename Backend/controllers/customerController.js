import asyncHandler from "express-async-handler";
import { Customer } from "../models/customerModel.js";

export const getAllCustomers = asyncHandler(async (req, res) => {
  try {
    const getAllCustomers = await Customer.find();
    res.json({
      message: "All customers fetched.",
      success: true,
      data: getAllCustomers,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const createCustomer = asyncHandler(async (req, res) => {
  const mobile = req.body.mobile;

  const customerExists = await Customer.findOne({ mobile });

  if (!customerExists) {
    const newCustomer = await Customer.create(req.body);
    res.json({
      message: "New Customer created",
      success: true,
      data: newCustomer,
    });
  } else {
    throw new Error("Customer already exists.");
  }
});

export const getSingleCustomer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getCustomer = await Customer.findById(id);
    res.json({
      message: "Customer fetched.",
      success: true,
      data: getCustomer,
    });
  } catch (error) {
    throw new Error(error);
  }
});
