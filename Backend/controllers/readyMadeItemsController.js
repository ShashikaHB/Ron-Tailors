import { ReadyMadeItem } from "../models/readyMadeItemModel.js";
import asyncHandler from "express-async-handler";

export const createReadyMadeItem = asyncHandler(async (req, res) => {
  const name = req.body.name;

  const readyMadeItemExists = await ReadyMadeItem.findOne({ name });

  if (!readyMadeItemExists) {
    const newReadyMadeItem = await ReadyMadeItem.create(req.body);
    res.json({
      message: "New material created",
      success: true,
      data: newReadyMadeItem,
    });
  } else {
    throw new Error("Material already exists.");
  }
});

export const getAllReadyMadeItems = asyncHandler(async (req, res) => {
  try {
    const getAllReadyMadeItems = await ReadyMadeItem.find();
    res.json({
      message: "All ready made items fetched.",
      success: true,
      data: getAllReadyMadeItems,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const getSingleReadyMadeItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getReadyMadeItem = await ReadyMadeItem.findById(id);
    res.json({
      message: "Ready made item fetched.",
      success: true,
      data: getReadyMadeItem,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const updateReadyMadeItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const updatedMaterial = await ReadyMadeItem.findByIdAndUpdate(
      id,
      {
        name: req?.body?.name,
        color: req?.body?.color,
        unitPrice: req?.body?.unitPrice,
        noOfUnits: req?.body?.noOfUnits,
        cost: req?.body?.cost,
        type: req?.body?.type,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "Ready Made Item updated.",
      success: true,
      data: updatedMaterial,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteReadyMadeItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const deleteReadyMadeItem = await ReadyMadeItem.findByIdAndDelete(id);
    res.json({
      message: "Ready Made Item Deleted Successfully.",
      success: true,
    });
  } catch (error) {
    throw new Error(error);
  }
});
