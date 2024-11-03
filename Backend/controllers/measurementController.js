import { Customer } from "../models/customerModel.js";
import { Measurement } from "../models/measurementModel.js";
import asyncHandler from "express-async-handler";
import { getDocId } from "../utils/docIds.js";
import { SalesOrder } from "../models/salesOrderModel.js";

export const createMeasurement = asyncHandler(async (req, res) => {
    const customerId = req.body.customer

    if (!customerId) {
      throw new Error("Customer ID is required.");
    }
      const customer = await Customer.findOne({ customerId }).lean().exec();

    if (!customer) {
      throw new Error(`No customer found for ${customerId}`);
    }

  const measurementData = { ...req.body, customer: customer._id};

  const newMeasurement = await Measurement.create(measurementData);
  if (!newMeasurement) {
    res.status(500);
    throw new Error("Internal server Error");
  }
  res.json({
    message: "New Measurement created",
    success: true,
    data: newMeasurement,
  });
});

export const getAllMeasurements = asyncHandler(async (req, res) => {
  const allMeasurements = await Measurement.find()
    // .populate({
    //   path: "customer", // Field name in Measurement schema
    //   model: "Customer", // Name of the Customer model
    //   select: "name mobile -_id customerId", // Optional: Specify fields to select from Customer // Specify fields to include from the Customer model
    // })
    .lean()
    .select("-createdAt -updatedAt -_id -__v");
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
    .populate("user", "userId")
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
  const { measurementId } = req.params;

  const measurement = await Measurement.findOne({ measurementId })
    .lean()
    .exec();

  if (!measurement) {
    res.status(404);
    throw new Error("No Measurement found to update.");
  }

  const updatedMeasurement = await Measurement.findByIdAndUpdate(
    measurement._id,
    {
      style: req?.body?.style,
      remarks: req?.body?.remarks,
      isNecessary: req?.body?.isNecessary,
      itemType: req?.body?.itemType,
      estimatedReleaseDate: req?.body?.estimatedReleaseDate,
      measurements: req?.body?.measurements,
    },
    {
      new: true,
    }
  );

  // Populate the customer field inside the measurement
  const populatedMeasurement = await Measurement.findById(updatedMeasurement._id)
    .populate({
      path: "customer", // Populate customer
      select: "name email mobile -_id", // Select specific fields for customer
    })
    .lean()
    .exec();

  res.json({
    message: "Measurement updated.",
    success: true,
    data: populatedMeasurement,
  });
});

// [TODO]- implement this method correctly if needed.
export const deleteMeasurement = asyncHandler(async (req, res) => {
  const { measurementId } = req.params;

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
// [TODO]- implement this method correctly if needed.
export const getPreviousMeasurements = asyncHandler(async (req, res) => {
  const { customerId, productType } = req.params;

  if (!customerId || !productType) {
    throw new Error("customer and product details not found!")
  }

  const customerObjId=  await getDocId(Customer, 'customerId', Number(customerId)) 

  const measurements = await Measurement.find({
    customer: customerObjId,          // Match the customerId
    itemType: productType,          // Match the productType (itemType in the schema)
  }).populate('customer').lean();           // Populate the customer field

  if (!measurements) {
    throw new Error('Measurements not found for given customer and item type!')
  }

  const updatedMeasurements  = measurements.map((measurement)=> ({
    ...measurement, remarks: ''
  }))

  // Return the list of measurements with populated customer data
  res.json({
    message: "Measurements retrieved successfully.",
    success: true,
    data: updatedMeasurements,
  });
});

export const getMeasurementData = asyncHandler(async (req, res) => {
    const { startDate, endDate, itemType, store } = req.query;
  
    if (!startDate || !endDate || !itemType) {
      return res.status(400).json({
        message: "startDate, endDate, and itemType are required.",
        success: false,
      });
    }
  
    // Convert the start and end date into the correct format, including time.
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999); // Ensure we capture all records for that day.
  
    // Step 1: Fetch all sales orders within the date range without filtering on itemType yet.
    const orders = await SalesOrder.find({
      orderDate: { $gte: start, $lte: end }, store
    })
      .populate({
        path: "orderDetails.products",
        populate: {
          path: "measurement", // Populate measurement details
          select: "-__v -createdAt -updatedAt", // Exclude unnecessary fields
          populate: {
            path: "customer", // Populate customer inside measurement
            select: "name mobile", // Only select relevant fields from customer
          },
        },
      }).populate("customer")
      .lean(); // Lean makes sure we get plain JavaScript objects instead of Mongoose documents
  
    // Debugging log to check if orders are fetched
    console.log("Orders Fetched: ", orders);
  
    // Step 2: Manually filter the products to get measurements for the given itemType.
    const measurements = [];
  
    orders.forEach((order) => {
      order.orderDetails.forEach((detail) => {
        detail.products.forEach((product) => {
          if (product.itemType === itemType && product.measurement) {
            measurements.push({...product.measurement, orderId: order.salesOrderId}); // Push the measurement to the result
          }
        });
      });
    });

    res.json({
      message: "Measurements fetched.",
      success: true,
      data: measurements,
    });
  });
