import { Attendance } from "../models/attendanceModel.js";
import { MonthlySummary } from "../models/monthlySummaryModel.js";
import { SalaryModel } from "../models/salaryModel.js";
import { User } from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -_id -__v -createdAt -updatedAt -refreshToken")
      .lean()
      .exec();

    if (!users) {
      return res.status(404).json({
        message: "No users found.",
        success: false,
      });
    }
    res
      .status(200)
      .json({ message: "All users fetched.", success: true, data: users });
  } catch (error) {
    throw new Error(error);
  }
});

export const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new Error("User id is required.");
  }

  const user = await User.findOne({ userId: id })
    .select("-password -_id -__v -refreshToken")
    .lean();
  if (!user) {
    res.status(404);
    throw new Error("User not Found!");
  }
  res.json({
    message: "Users fetched.",
    success: true,
    user,
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new Error("User id is required.");
  }

  const user = await User.findOne({ userId: id }).exec();

  if (req?.body?.password) {
    user.password = req?.body?.password;
  }
  // Handle save password here due to pre save hook in mongoose schema to convert password to hash string
  const saveNewPassword = await user.save();

  if (!user) {
    throw new Error("User does not exist.");
  }
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      name: req?.body?.name,
      mobile: req?.body?.mobile,
      salaryGrade: req?.body?.salaryGrade,
      role: req?.body?.role,
      isActive: req?.body?.isActive,
      salary: req?.body?.salary,
    },
    {
      new: true,
    }
  );

  // Save the user, triggering the pre-save hook
  await user.save();
  if (!updatedUser || (req?.body?.password && !saveNewPassword)) {
    throw new Error("User could not be updated.");
  }
  res.json({
    message: "Users updated.",
    success: true,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({ userId: id }).select("_id").lean().exec();

  if (!user) {
    throw new Error("User does not exist.");
  }

  const deleteUser = await User.findByIdAndDelete(user._id);
  res.json({
    message: "Users Deleted Successfully.",
    success: true,
  });
});

// @desc    Update user's salary grade
// @route   PUT /api/users/:userId/salaryGrade
// @access  Private/Admin
export const updateSalaryGrade = asyncHandler(async (req, res) => {
    const { userId } = req.params;  // Extract the userId from request parameters
    const { salaryGrade } = req.body;  // Extract the salaryGrade from the request body
  
    // Find the user by userId
    const user = await User.findOne({ userId });
  
    if (!user) {
      res.status(404);
      throw new Error('User not found.');
    }
  
    // Update user's salaryGrade
    user.salaryGrade = salaryGrade;
  
    // Save the updated user details
    const updatedUser = await user.save();
  
    // Send response
    res.json({
      message: "User's salary grade updated successfully.",
      success: true,
      data: updatedUser,
    });
  });

// Controller function to mark attendance and update monthly summary
export const markAttendance = asyncHandler(async (req, res) => {
    const { userId, date } = req.body;
  
    // Step 1: Fetch the user by ID
    const user = await User.findOne({userId});
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
  
    // Step 2: Check if attendance for the user is already marked for this date
    const attendanceExists = await Attendance.findOne({
      user: user._id,
      date: new Date(date).toISOString().split('T')[0], // Ensure date is just for the day
    });
  
    if (attendanceExists) {
        res.status(400)
        throw new Error ("Attendance for this user is already marked for this date.")
    }
  
    // Step 3: Mark attendance
    const attendance = new Attendance({
      user: user._id,
      date: new Date(date).toISOString().split('T')[0],
    });
    await attendance.save();
  
    // Step 4: Get the current month (in 'YYYY-MM' format)
    const currentMonth = new Date(date).toISOString().slice(0, 7);
  
    // Step 5: Check if there's a MonthlySummary for this user for the current month
    let monthlySummary = await MonthlySummary.findOne({
      user: user._id,
      month: currentMonth,
    });
  
    // Step 6: If no monthly summary exists, create one
    const salaryData = await SalaryModel.findOne();
    if (!monthlySummary) {
      // Fetch salary data based on role and salary grade
      let fixedSalary = 0;
  
      // Determine the fixed salary based on user's role and salary grade
      if (user.role === 'Sales Person') {
         fixedSalary = salaryData.salesPerson[`grade${user.salaryGrade}`];
        
      } else if (user.role === 'Cleaning') {
        fixedSalary = salaryData.cleaningStaff[`grade${user.salaryGrade}`];
      }
  
      // Create a new monthly summary with the fixed salary
      monthlySummary = new MonthlySummary({
        user: user._id,
        month: currentMonth,
        fixedSalary: fixedSalary,
        daysWorked: 0,
        totalSalary: fixedSalary, // Start with the fixed salary
        bonus: 0,
      });
    }

    // Step 7: Increment the days worked
    monthlySummary.daysWorked += 1;
    
    let bonus
    // Determine the daily salary based on user role and salary grade
    if (user.role === 'Sales Person') {
      bonus = salaryData.salesPerson.bonus;
    } else if (user.role === 'Cleaning') {
      bonus = salaryData.cleaningStaff.bonus;
    }
  
    // Step 10: Add bonus to total salary if daysWorked >= 25
    if (monthlySummary.daysWorked >= 25) {
      monthlySummary.bonus += bonus;
      monthlySummary.totalSalary += bonus;
    }
  
    // Save the updated monthly summary
    await monthlySummary.save();
  
    res.status(200).json({
      message: 'Attendance marked and monthly summary updated successfully.',
      success: true,
    });
  });
