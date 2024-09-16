import { RentItem } from "../models/rentItemModel.js";
import asyncHandler from "express-async-handler";

export const createRentItem = asyncHandler(async (req, res) => {
  const color = req.body.color;
  const size = req.body.size;
  const description = req.body.description;
  const itemType = req.body.itemType;

  if (!description || !itemType) {
    throw new Error("Missing values in body create rent item");
  }

  const rentItemExists = await RentItem.findOne({
    color,
    size,
    description,
    itemType,
  })
    .lean()
    .exec();

  if (!rentItemExists) {
    const newRentItem = await RentItem.create(req.body);
    if (newRentItem) {
      res.json({
        message: "New rentItem created",
        success: true,
      });
    } else {
      throw new Error("Internal Server Error!!");
    }
  } else {
    throw new Error("RentItem already exists.");
  }
});

export const getAllRentItems = asyncHandler(async (req, res) => {
  try {
    const allRentItems = await RentItem.find().lean().select("-_id -__v");
    res.json({
      message: "All materials fetched.",
      success: true,
      data: allRentItems,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const getSingleRentItem = asyncHandler(async (req, res) => {
  const { rentItemId } = req.params;

  if (!rentItemId) {
    res.status(404);
    throw new Error("RentItem Id not found");
  }

  const singleRentItem = await RentItem.findOne({ rentItemId })
    .select("-_id -__v")
    .lean()
    .exec();

  if (!singleRentItem) {
    res.status(404);
    throw new Error("RentItem not found!");
  }
  res.json({
    message: "RentItem fetched.",
    success: true,
    data: singleRentItem,
  });
});

export const updateRentItem = asyncHandler(async (req, res) => {
  const { rentItemId } = req.params;

  const rentItem = await RentItem.findOne({ rentItemId }).lean().exec();

  if (!rentItem) {
    res.status(404);
    throw new Error("No rentItem found to update.");
  }

  const updatedRentItem = await RentItem.findByIdAndUpdate(
    rentItem._id,
    {
      description: req?.body?.description,
      color: req?.body?.color,
      size: req?.body?.size,
      status: req?.body?.status,
      itemType: req?.body?.itemType,
    },
    {
      new: true,
    }
  );
  res.json({
    message: "RentItem updated.",
    success: true,
    data: updatedRentItem,
  });
});

export const deleteRentItem = asyncHandler(async (req, res) => {
  const { rentItemId } = req.params;

  const rentItem = await RentItem.findOne({ rentItemId }).lean().exec();

  const deleteRentItem = await RentItem.findByIdAndDelete(rentItem._id);

  if (!deleteRentItem) {
    throw new Error("Rent Item deletion failed.");
  }

  res.json({
    message: "RentItem Deleted Successfully.",
    success: true,
  });
});

export const searchRentItem = asyncHandler(async (req, res) => {
  const searchQuery = req.query.searchQuery;

  if (!searchQuery) {
    res.status(400);
    throw new Error("Search query parameter not provided.");
  }

  try {
    // Construct the query to find customers by mobile or name
    const rentItem = await RentItem.findOne({ rentItemId: Number(searchQuery) })
      .lean()
      .select("-_id -__v")
      .exec();

    if (!rentItem) {
      res.status(404);
      throw new Error("Rent Item not found.");
    }

    res.json({
      message: "Rent Item data fetched successfully.",
      success: true,
      data: rentItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
