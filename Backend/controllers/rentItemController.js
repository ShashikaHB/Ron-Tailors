import { RentItem } from "../models/rentItemModel.js";
import asyncHandler from "express-async-handler";
import { RentOrder } from "../models/rentOrderModel.js";

export const createRentItem = asyncHandler(async (req, res) => {
  const { store } = req.query;

  const description = req.body.description;
  const itemType = req.body.itemType;
  const rentItemId = req.body.rentItemId;

  if (!description || !itemType || !rentItemId) {
    throw new Error("Missing values in body create rent item");
  }

  const rentItemExists = await RentItem.findOne({
    rentItemId,
  })
    .lean()
    .exec();

  if (!rentItemExists) {
    const newRentItem = await RentItem.create({ ...req.body, store });
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
  const { store } = req.query;

  try {
    const allRentItems = await RentItem.find({ store })
      .lean()
      .select("-_id -__v");
    // Sort orders by extracting the numeric part of salesOrderId
    const sortedRentItems = allRentItems.sort((a, b) => {
      const aId = parseInt(a.rentItemId.replace(/\D/g, ""), 10);
      const bId = parseInt(b.rentItemId.replace(/\D/g, ""), 10);
      return bId - aId;
    });
    res.json({
      message: "All materials fetched.",
      success: true,
      data: sortedRentItems,
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
  const newRentOutId = req.body.newRentOutId;

  const rentItemIdSearch = req?.body?.newRentOutId
    ? req?.body?.newRentOutId
    : rentItemId;

  const rentItem = await RentItem.findOne({ rentItemId: rentItemIdSearch })
    .lean()
    .exec();

  if (!rentItem) {
    res.status(404);
    throw new Error("No rentItem found to update.");
  }

  const updatedRentItem = await RentItem.findByIdAndUpdate(
    rentItem._id,
    {
      rentItemId: rentItemId,
      description: req?.body?.description,
      color: req?.body?.color,
      size: req?.body?.size,
      status: req?.body?.status,
      itemType: req?.body?.itemType,
      isNewRentOut: false,
    },
    {
      new: true,
    }
  );

  if (newRentOutId) {
    // Step 2: Find the rent order that contains the newRentOutId in its details
    const rentOrder = await RentOrder.findOne({
      "rentOrderDetails.rentItemId": newRentOutId,
    });

    if (!rentOrder) {
      res.status(404);
      throw new Error(`No rent order found with ID ${newRentOutId}.`);
    }

    // Step 3: Update the rent order details with the new rentItemId
    for (let detail of rentOrder.rentOrderDetails) {
      if (detail.rentItemId === newRentOutId) {
        detail.rentItemId = rentItemId; // Update the rent item ID
      }
    }

    // Save the updated rent order
    await rentOrder.save();
  }
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
  const { searchQuery, store } = req.query;

  if (!searchQuery) {
    res.status(400);
    throw new Error("Search query parameter not provided.");
  }

  try {
    // Construct the query to find customers by mobile or name
    const rentItem = await RentItem.findOne({ rentItemId: searchQuery, store })
      .lean()
      .select("-_id -__v")
      .exec();

    if (!rentItem) {
      res.status(404);
      throw new Error("Rent Item not found.");
    }

    if (rentItem.status !== "Available") {
      throw new Error("Item already Rented");
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
