import { RentOrder } from "../models/rentOrderModel.js";

export const getPopulatedRentOrders = async ({ filter, options }) => {
  const pipeline = [
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "customers",
        // Name of the products collection
        localField: "customer",
        // productId in the sales order
        foreignField: "customerId",
        // productId in the products collection
        as: "customer",
      },
    },
    {
      $unwind: {
        path: "$customer",
        preserveNullAndEmptyArrays: true, // Retain orders without a customer
      },
    },
  ];

  // Filter `rentOrderDetails` by `rentItemId` if provided
  if (options?.rentItemId) {
    pipeline.push({
      $addFields: {
        rentOrderDetails: {
          $filter: {
            input: "$rentOrderDetails",
            as: "detail",
            cond: { $eq: ["$$detail.rentItemId", options?.rentItemId] },
          },
        },
      },
    });
  }

  const rentOrderId = filter?.rentOrderId ?? null;

  if (!rentOrderId) {
    pipeline.push({
      $sort: {
        rentOrderId: -1,
      },
    });
  }

  const rentOrders = await RentOrder.aggregate(pipeline);

  // Return a single object if querying by rentOrderId
  if (filter.rentOrderId) {
    return rentOrders[0] || null; // Return the first object or null if no match
  }

  return rentOrders;
};
