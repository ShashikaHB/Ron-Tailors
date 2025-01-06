import { SalesOrder } from "../models/salesOrderModel.js";

export const getPopulatedSalesOrders = async ({ filter, options }) => {
  const pipeline = [
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "customers",
        localField: "customer",
        foreignField: "customerId",
        as: "customer",
      },
    },
    {
      $unwind: {
        path: "$customer",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$orderDetails",
      },
    },
    {
      $unwind: {
        path: "$orderDetails.products",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "products",
        let: { productField: "$orderDetails.products" },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ["$productId", "$$productField"] },
                  { $eq: ["$_id", "$$productField"] },
                ],
              },
            },
          },
          {
            $lookup: {
              from: "measurements",
              localField: "measurement",
              foreignField: "_id",
              as: "measurement",
            },
          },
          {
            $unwind: {
              path: "$measurement",
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
        as: "productDetails",
      },
    },
    {
      $unwind: {
        path: "$productDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: {
          orderId: "$_id",
          orderDetailsId: "$orderDetails._id",
        },
        description: {
          $first: "$orderDetails.description",
        },
        category: {
          $first: "$orderDetails.category",
        },
        amount: {
          $first: "$orderDetails.amount",
        },
        products: {
          $push: "$productDetails",
        },
        rentItems: {
          $first: "$orderDetails.rentItems",
        },
        salesOrderId: {
          $first: "$salesOrderId",
        },
        store: {
          $first: "$store",
        },
        customer: {
          $first: "$customer",
        },
        orderDate: {
          $first: "$orderDate",
        },
        deliveryDate: {
          $first: "$deliveryDate",
        },
        weddingDate: {
          $first: "$weddingDate",
        },
        salesPerson: {
          $first: "$salesPerson",
        },
        linkedRentOrder: {
          $first: "$linkedRentOrder",
        },
        fitOnRounds: {
          $first: "$fitOnRounds",
        },
        totalPrice: {
          $first: "$totalPrice",
        },
        subTotal: {
          $first: "$subTotal",
        },
        discount: {
          $first: "$discount",
        },
        advPayment: {
          $first: "$advPayment",
        },
        balance: {
          $first: "$balance",
        },
        paymentType: {
          $first: "$paymentType",
        },
        orderStatus: {
          $first: "$orderStatus",
        },
      },
    },
    {
      $group: {
        _id: "$_id.orderId",
        salesOrderId: { $first: "$salesOrderId" },
        store: { $first: "$store" },
        customer: { $first: "$customer" },
        orderDate: { $first: "$orderDate" },
        deliveryDate: { $first: "$deliveryDate" },
        weddingDate: { $first: "$weddingDate" },
        linkedRentOrder: { $first: "$linkedRentOrder" },
        salesPerson: { $first: "$salesPerson" },
        fitOnRounds: { $first: "$fitOnRounds" },
        totalPrice: { $first: "$totalPrice" },
        subTotal: { $first: "$subTotal" },
        discount: { $first: "$discount" },
        advPayment: { $first: "$advPayment" },
        balance: { $first: "$balance" },
        paymentType: { $first: "$paymentType" },
        orderStatus: { $first: "$orderStatus" },
        orderDetails: {
          $push: {
            _id: "$_id.orderDetailsId",
            description: "$description",
            category: "$category",
            amount: "$amount",
            products: "$products",
            rentItems: "$rentItems",
          },
        },
      },
    },
  ];

  const salesOrderId = filter?.salesOrderId || null;

  // Add sorting only when retrieving multiple orders
  if (!salesOrderId) {
    pipeline.push({
      $sort: {
        salesOrderId: -1,
      },
    });
  }

  const salesOrders = await SalesOrder.aggregate(pipeline);

  // Return a single object if `salesOrderId` is provided
  if (salesOrderId || options?.updateProduct) {
    return salesOrders[0] || null;
  }

  // Return all matching sales orders
  return salesOrders;
};