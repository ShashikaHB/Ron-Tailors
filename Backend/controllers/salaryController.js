import asyncHandler from "express-async-handler";
import { SalaryModel } from "../models/salaryModel.js";

export const createSalary = asyncHandler(async (req, res) => {
    const existingSalary = await SalaryModel.findOne();
  
    if (existingSalary) {
      res.status(400);
      throw new Error("Salary record already exists. Only one salary record is allowed.");
    }
  
    const newSalary = new SalaryModel(req.body);
  
    const createdSalary = await newSalary.save();
  
    res.status(201).json({
      message: "Salary record created successfully.",
      success: true,
      data: createdSalary,
    });
  });

// @desc    Get the salary record
// @route   GET /api/salaries
// @access  Public
export const getSalary = asyncHandler(async (req, res) => {
  const salary = await SalaryModel.findOne().lean();

  if (!salary) {
    res.status(404);
    throw new Error("Salary record not found.");
  }

  res.json({
    message: "Salary record fetched successfully.",
    success: true,
    data: salary,
  });
});

// @desc    Update the salary record
// @route   PATCH /api/salaries
// @access  Public
export const updateSalary = asyncHandler(async (req, res) => {
  const salaryUpdates = req.body;

  const salary = await SalaryModel.findOne();

  if (!salary) {
    res.status(404);
    throw new Error("Salary record not found.");
  }

  // Update the salary record with new values
  Object.keys(salaryUpdates).forEach((key) => {
    if (salaryUpdates[key] && typeof salaryUpdates[key] === "object") {
      Object.keys(salaryUpdates[key]).forEach((subKey) => {
        salary[key][subKey] = salaryUpdates[key][subKey];
      });
    } else {
      salary[key] = salaryUpdates[key];
    }
  });

  const updatedSalary = await salary.save();

  res.json({
    message: "Salary record updated successfully.",
    success: true,
    data: updatedSalary,
  });
});
