import asyncHandler from "express-async-handler";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";
import { Measurement } from "../models/measurementModel.js";
import { Material } from "../models/materialModel.js";
import { getDocId } from "../utils/docIds.js";
import { PiecePrices } from "../models/piecePriceModel.js";
import { logWork } from "./workLogController.js";
import { updateUserSummaryWithPieceType } from "./monthlySummaryController.js";
import { fetchMaterialById, fetchUserById } from "../utils/product.js";
import { deductMaterialUnits } from "./materialController.js";
import { RentOrder } from "../models/rentOrderModel.js";
import { RentItem } from "../models/rentItemModel.js";
import { SalesOrder } from "../models/salesOrderModel.js";

// @desc    Create a new product
// @route   POST /api/products
// @access  Public
export const createProduct = asyncHandler(async (req, res) => {
  const { itemType, itemCategory, price } = req.body;

  if (!itemType || !itemCategory || !price) {
    res.status(400);
    throw new Error("Required fields are not provided.");
  }

  const newProduct = await Product.create(req.body);

  if (!newProduct) {
    throw new Error("Internal server error product not created.");
  }

  //   const populatedProduct = await Product.findById(newProduct._id)
  //     .populate("cutter", "name") // Replace 'name' with the fields you want to populate
  //     .populate("tailor", "name")
  //     .populate("measurer", "name")
  //     .populate("materials.material")
  //     .lean()
  //     .exec();

  res.json({
    message: "New product created Successfully.",
    success: true,
    data: newProduct.productId,
  });
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate(
      "cutter",
      "-createdAt -updatedAt -password -_id -__v -refreshToken"
    )
    .populate(
      "tailor",
      " -createdAt -updatedAt -__v -password -_id -__v -refreshToken"
    )
    .populate(
      "measurer",
      " -createdAt -updatedAt -__v -password -_id -__v -refreshToken"
    )
    .populate({
      path: "measurement",
      select: "-_id -createdAt -updatedAt -__v",
      //   populate: {
      //     path: "product",
      //     select: "-_id -createdAt -updatedAt -__v",
      //   },
    })
    .populate({
      path: "materials.material",
      select: "-_id -createdAt -updatedAt -__v",
    })
    .lean()
    .select("-_id -updatedAt -createdAt -__v")
    .exec();
  res.json({
    message: "All Products Fetched Successfully.",
    success: true,
    data: products,
  });
});

export const getSingleProduct = asyncHandler(async (req, res) => {
  const { productId } = req?.params;

  if (!productId) {
    throw new Error("productId not found!");
  }

  const product = await Product.findOne({ productId: productId })
    .populate(
      "cutter",
      "-createdAt -updatedAt -password -_id -__v -refreshToken"
    )
    .populate(
      "tailor",
      " -createdAt -updatedAt -__v -password -_id -__v -refreshToken"
    )
    .populate(
      "measurer",
      " -createdAt -updatedAt -__v -password -_id -__v -refreshToken"
    )
    .populate({
      path: "measurement",
      select: "-_id -createdAt -updatedAt -__v",
      populate: {
        path: "customer", // Populate the customer field inside the measurement
        select: "name customerId -_id", // Fetch 'name', 'email', and 'mobile' for customer, exclude '_id'
      },
    })
    .populate({
      path: "materials.material",
      select: "-_id -createdAt -updatedAt -__v",
    })
    .lean()
    .select("-_id -updatedAt -createdAt -__v")
    .exec();

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({
    message: "Product fetched",
    success: true,
    data: product,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const {
    status,
    measurement: measurementId,
    cutter: cutterId,
    tailor: tailorId,
    measurer: measurerId,
    materials,
    ...rest
  } = req.body;

  // Fetch the product to update
  const product = await Product.findOne({ productId });
  if (!product) {
    req.statusCode = 404;
    throw new Error("Product not found.");
  }

  // Fetch measurement if provided
  let measurement = null;
  if (measurementId) {
    measurement = await Measurement.findOne({ measurementId }).lean().exec();
    if (!measurement) {
      throw new Error(`No measurement found for ID ${measurementId}`);
    }
  }

  // Conditionally fetch cutter, tailor, and measurer
  const [cutter, tailor, measurer] = await Promise.all([
    cutterId && cutterId !== 0 ? fetchUserById(cutterId, "cutter") : null,
    tailorId && tailorId !== 0 ? fetchUserById(tailorId, "tailor") : null,
    measurerId && measurerId !== 0
      ? fetchUserById(measurerId, "measurer")
      : null,
  ]);

  // Conditionally fetch materials if provided
  let materialsData = [];
  if (materials && materials.length > 0) {
    materialsData = await Promise.all(
      materials.map(async ({ material: materialId, unitsNeeded }) => {
        const material = await fetchMaterialById(materialId);
        if (material) {
          return { material: material._id, unitsNeeded };
        }
      })
    );
    await deductMaterialUnits(materials); // Deduct units from materials
  }

  // Update product fields only if provided
  if (status) product.status = status;
  if (measurement) product.measurement = measurement._id;
  if (cutter) product.cutter = cutter._id;
  if (tailor) product.tailor = tailor._id;
  if (measurer) product.measurer = measurer._id;
  if (materialsData.length > 0) product.materials = materialsData;

  Object.assign(product, rest);

  // Save the updated product
  const updatedProduct = await product.save();

  // Populate references for the response
  const populatedProduct = await Product.findById(updatedProduct._id)
    .populate("cutter", "name")
    .populate("tailor", "name")
    .populate("measurer", "name")
    .populate("measurement")
    .populate("materials.material");

  // Send the response
  res.json({
    message: "Product updated successfully.",
    success: true,
    data: populatedProduct,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req?.params;

  if (!productId) {
    throw new Error("Product Id not found!");
  }

  const product = await getDocId(Product, "productId", productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const deletedProduct = await Product.deleteOne({ productId });

  if (!deletedProduct) {
    throw new Error("Server Error cannot delete product");
  }

  res.json({
    message: `Product deleted`,
    success: true,
  });
});

export const searchProduct = asyncHandler(async (req, res) => {
  const searchQuery = req.query.searchQuery;

  if (!searchQuery) {
    res.status(400);
    throw new Error("Search query parameter not provided.");
  }

  try {
    // Construct the query to find customers by mobile or name
    const product = await Product.findOne({ productId: Number(searchQuery) })
      .populate("measurement")
      .lean()
      .select("-_id -__v")
      .exec();

    if (!product) {
      res.status(404);
      throw new Error("Product not found.");
    }

    res.json({
      message: "Product data fetched successfully.",
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export const updateProductStatus = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { status } = req.body;

  if (!status || !productId) {
    res.status(400);
    throw new Error("Status is required.");
  }

  const product = await Product.findOne({ productId });

  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  // Get the current status of the product
  const currentStatus = product.status;

  const statusSequence = [
    "Not Started",
    "Cutting Done",
    "Tailoring Started",
    "Tailoring Done",
  ];

  const currentStatusIndex = statusSequence.indexOf(currentStatus);
  const newStatusIndex = statusSequence.indexOf(status);

  // Prevent invalid status transitions
  if (newStatusIndex === -1) {
    res.status(400);
    throw new Error(`Invalid status: "${status}".`);
  }

  // Check if the new status is allowed based on the current status
  if (newStatusIndex <= currentStatusIndex) {
    res.status(400);
    throw new Error(
      `Cannot change status from "${currentStatus}" to "${status}".`
    );
  }
  // Check if the new status is allowed based on the current status
  if (newStatusIndex - currentStatusIndex > 1) {
    res.status(400);
    throw new Error(
      `Cannot change status from "${currentStatus}" to "${status}".`
    );
  }

  // Example: Once "Tailoring Done" is reached, status cannot be changed
  if (currentStatus === "Tailoring Done") {
    res.status(400);
    throw new Error(
      'Product status is "Tailoring Done". No further updates are allowed.'
    );
  }

  product.status = status;

  let user = null;
  let piecePrice = 0;

  // Fetch prices based on the product itemType
  const piecePriceData = await PiecePrices.findOne({
    itemType: product.itemType,
  });
  if (!piecePriceData) {
    res.status(404);
    throw new Error("Piece price not found for the item type.");
  }

  if (status === "Cutting Done") {
    if (!product.cutter) {
      throw new Error("Cutter is not defined for the product!");
    }
    user = product.cutter;
    piecePrice = piecePriceData.cuttingPrice;
  }

  if (status === "Tailoring Started") {
    product.status = status;
    const updatedProduct = await product.save();
    return res.json({
      message: 'Product status updated successfully to "Tailoring Started".',
      success: true,
      data: updatedProduct,
    });
  }

  if (status === "Tailoring Done") {
    if (!product.tailor) {
      throw new Error("Tailor is not defined for the product!");
    }
    user = product.tailor;
    piecePrice = piecePriceData.tailoringPrice;
  }

  const newlogWork = await logWork(
    user,
    status,
    product.itemType,
    product.productId,
    piecePrice
  );

  if (product.isNewRentOut && status === "Tailoring Done") {
    // Fetch the SalesOrder containing this product
    const salesOrder = await SalesOrder.findOne({
      "orderDetails.products": product._id,
    }).populate("customer");
    if (!salesOrder) {
      res.status(404);
      throw new Error("Sales order containing this product not found.");
    }

    // Create a new RentItem
    const rentItem = await RentItem.create({
      color: product.color,
      size: product.size,
      description: `New RentOut: ${product.itemType}`,
      itemCategory: product.itemCategory,
      itemType: product.itemType,
      status: "Rented", // Set as rented
    });

    // Create a new RentOrder with customer details from the SalesOrder
    const rentOrder = await RentOrder.create({
      customer: salesOrder.customer,
      store: salesOrder.store,
      rentDate: new Date(), // Set current date as the rent date
      returnDate: new Date(), // You can modify return date based on logic
      rentOrderDetails: [
        {
          description: `New RentOut: ${product.itemType}`,
          color: product.color,
          size: product.size,
          rentItemId: rentItem.rentItemId,
          itemCategory: product.itemCategory,
          itemType: product.itemType,
          amount: product.rentPrice || 0, // Set rent price
        },
      ],
      totalPrice: product.rentPrice || 0,
      subTotal: product.rentPrice || 0,
      paymentType: salesOrder.paymentType
    });
  }

  const currentMonth = new Date().toISOString().slice(0, 7);
  const updateMonthlySalary = await updateUserSummaryWithPieceType(
    user,
    currentMonth,
    product.itemType,
    product.itemCategory,
    status,
    piecePrice
  );

  const updatedProduct = await product.save();

  res.json({
    message: "Product status updated and RentOrder created.",
    success: true,
    updatedProduct,
  });
});
