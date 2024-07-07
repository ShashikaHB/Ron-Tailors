import { Measurement } from "../models/measurementModel.js";
import asyncHandler from "express-async-handler";

export const createMeasurement = asyncHandler(async (req, res) => {
  const newMeasurement = await Measurement.create(req.body);
  if (!newMeasurement) {
    res.status(500);
    throw new Error("Internal server Error");
  }
  res.json({
    message: "New Measurement created",
    success: true,
  });
});

export const getAllMeasurements = asyncHandler(async (req, res) => {
  const allMeasurements = await Measurement.find().lean();
  if (!allMeasurements) {
    res.status(500);
    throw new Error("Internal server error.");
  }
  res.json({
    message: "All Measurements fetched.",
    success: true,
    data: allMeasurements,
  });
});

export const getSingleMeasurement = asyncHandler(async (req, res) => {
  const { MeasurementId } = req.params;

  if (!MeasurementId) {
    res.status(404);
    throw new Error("Measurement Id not found");
  }

  const singleMeasurement = await Measurement.findOne({ MeasurementId })
    .select("-_id -__v -createdAt -updatedAt")
    .lean()
    .exec();

  if (!singleMeasurement) {
    res.status(404);
    throw new Error("Measurement not found!");
  }
  res.json({
    message: "Measurement fetched.",
    success: true,
    data: singleMeasurement,
  });
});

export const updateMeasurement = asyncHandler(async (req, res) => {
  const { MeasurementId } = req.params;

  const Measurement = await Measurement.findOne({ MeasurementId })
    .lean()
    .exec();

  if (!Measurement) {
    res.status(404);
    throw new Error("No Measurement found to update.");
  }

  const updatedMeasurement = await Measurement.findByIdAndUpdate(
    Measurement._id,
    {
      style: req?.body?.style,
      remarks: req?.body?.remarks,
      isNecessary: req?.body?.isNecessary,
      unitPrice: req?.body?.unitPrice,
      estimatedReleaseDate: req?.body?.estimatedReleaseDate,
    },
    {
      new: true,
    }
  );
  res.json({
    message: "Measurement updated.",
    success: true,
    data: updatedMeasurement,
  });
});

// [TODO]- implement this method correctly if needed.
export const deleteMeasurement = asyncHandler(async (req, res) => {
  const { MeasurementId } = req.params;

  try {
    const deleteMeasurement = await Measurement.findByIdAndDelete(id);
    res.json({
      message: "Measurement Deleted Successfully.",
      success: true,
    });
  } catch (error) {
    throw new Error(error);
  }
});
