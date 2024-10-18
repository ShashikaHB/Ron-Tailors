import { Attendance } from "../models/attendanceModel.js";
import { MonthlySummary } from "../models/monthlySummaryModel.js";
import { PiecePrices } from "../models/piecePriceModel.js";
import { SalaryModel } from "../models/salaryModel.js";
import { User } from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export const updateUserSummaryWithPieceType = async (
  userId,
  month,
  itemType,
  category,
  actionType,
  piecePrice
) => {
  // Find the monthly summary for the user
  let summary = await MonthlySummary.findOne({ user: userId, month });

  if (!summary) {
    // If no summary exists, create one
    summary = new MonthlySummary({
      user: userId,
      month: month,
    });

    await summary.save();
  }

  // Determine if the action is "Cutting" or "Tailoring"
  if (actionType === "Cutting Done") {
    // Check if the itemType already exists in the piecesCut array
    const existingCutPiece = summary?.piecesCut.find(
      (p) => p.itemType === itemType
    );
    if (existingCutPiece) {
      // If it exists, increment the count
      existingCutPiece.count += 1;
    } else {
      // If not, push a new entry for the itemType
      summary.piecesCut.push({ itemType, count: 1 });
    }
  } else if (actionType === "Tailoring Done") {
    // Check if the itemType already exists in the piecesTailored array
    const existingTailoredPiece = summary?.piecesTailored.find(
      (p) => p.itemType === itemType
    );
    if (existingTailoredPiece) {
      // If it exists, increment the count
      existingTailoredPiece.count += 1;
    } else {
      // If not, push a new entry for the itemType
      summary.piecesTailored.push({ itemType, count: 1 });
    }
  }

  summary.totalSalary += piecePrice || 0;

  // Save the updated summary
  await summary.save();
};

export const logAttendanceAndUpdateSummary = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { date } = req.body; // Optional: specific attendance date, defaults to today

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Get the month in format "YYYY-MM" for the attendance
  const today = date ? new Date(date) : new Date();
  const currentMonth = today.toISOString().slice(0, 7);

  // Log attendance for today
  const existingAttendance = await Attendance.findOne({
    user: userId,
    date: today,
  });
  if (!existingAttendance) {
    await Attendance.create({ user: userId, date: today });
  }

  // Find or create the monthly summary for the current month
  let monthlySummary = await MonthlySummary.findOne({
    user: userId,
    month: currentMonth,
  });

  if (!monthlySummary) {
    monthlySummary = new MonthlySummary({
      user: userId,
      month: currentMonth,
      daysWorked: 0,
      totalSalary: 0,
    });
  }

  // Recalculate days worked (attendance count) for the month
  const attendanceRecords = await Attendance.find({
    user: userId,
    date: {
      $gte: new Date(`${currentMonth}-01`),
      $lt: new Date(`${currentMonth}-31`),
    },
  });

  const daysWorked = attendanceRecords.length;

  // Fetch the user's salary based on role and grade
  const salaryData = await SalaryModel.findOne({});
  let baseSalary = 0;
  let bonus = 0;

  if (user.role === "Sales Person") {
    baseSalary = salaryData.salesPerson[`grade${user.salaryGrade}`];
    bonus = salaryData.salesPerson.bonus;
  } else if (user.role === "Cleaning") {
    baseSalary = salaryData.cleaningStaff[`grade${user.salaryGrade}`];
    bonus = salaryData.cleaningStaff.bonus;
  }

  // Calculate total salary for the month (assuming 30-day month)
  const salaryPerDay = baseSalary / 30;
  const totalSalary = salaryPerDay * daysWorked + bonus;

  // Update the monthly summary
  monthlySummary.daysWorked = daysWorked;
  monthlySummary.totalSalary = totalSalary;
  monthlySummary.bonus = bonus;

  await monthlySummary.save();

  res.json({
    message: "Attendance recorded and salary updated successfully",
    success: true,
    data: monthlySummary,
  });
});

export const getMonthlySalaryReport = asyncHandler(async (req, res) => {
  const { month } = req.query; // e.g., "2024-09"

  if (!month) {
    res.status(400);
    throw new Error("Month is required (format: YYYY-MM)");
  }

  const summaries = await MonthlySummary.find({ month })
    .populate("user", "name role salaryGrade") // Populate user details
    .lean();

  const report = summaries.map((summary) => ({
    userId: summary.user._id,
    name: summary.user.name,
    role: summary.user.role,
    salaryGrade: summary.user.salaryGrade,
    daysWorked: summary.daysWorked,
    totalSalary: summary.totalSalary,
    bonus: summary.bonus,
  }));

  res.json({
    message: `Salary report for ${month}`,
    success: true,
    data: report,
  });
});

export const getAllMonthlyRecords = asyncHandler(async (req, res) => {
  const { month } = req.params;

  // If month is not provided, use the current month in "YYYY-MM" format
  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const targetMonth = month || currentMonth;

  const monthlyRecord = await MonthlySummary.find({ month: targetMonth })
    .populate("user", "name role") // Populate 'user' and select only 'name' and 'role'
    .lean();

  if (!monthlyRecord?.length > 0) {
    throw new Error("No Monthly records found!");
  }

  res.json({
    message: `Monthly summary fetched for ${targetMonth}`,
    data: monthlyRecord,
  });
});

export const updateMonthlySummaryWithSalary = async (
  userId,
  month,
  category,
  amount
) => {


    const user = await User.findOne({userId});


  const monthlySummary = await MonthlySummary.findOne({
    user: user._id,
    month,
  });

  if (!monthlySummary) {
    monthlySummary = new MonthlySummary({
      user: userId,
      month: currentMonth,
    });
  }

  if (category === "Salary Advance") {
    monthlySummary.advancePaid += amount;
    await monthlySummary.save();
  }
  monthlySummary.salaryPaid += amount;
  return await monthlySummary.save();
};
