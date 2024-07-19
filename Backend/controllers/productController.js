import asyncHandler from "express-async-handler";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";
import { Measurement } from "../models/measurementModel.js";
import { Material } from "../models/materialModel.js";
import { getDocId } from "../utils/docIds.js";

// @desc    Create a new product
// @route   POST /api/products
// @access  Public
export const createProduct = asyncHandler(async (req, res) => {
  const measurementId = req.body?.measurement;
  const cutterId = req.body?.cutter;
  const tailorId = req.body?.tailor;
  const measurerId = req.body?.measurer;
  const materials = req.body?.materials;

  if (!cutterId | !tailorId | !measurerId | !materials) {
    res.status(400);
    throw new Error("Required fields are not provided.");
  }
  let measurement;
  if (measurementId) {
    measurement = await Measurement.findOne({ measurementId }).lean().exec();
  }

  if (measurementId && !measurement) {
    res.status(404);
    throw new Error(`No measurement found for ID ${measurementId}`);
  }

  const cutter = await User.findOne({ userId: cutterId }).lean().exec();
  if (!cutter) {
    res.status(404);
    throw new Error(`No user found for ID ${cutterId}`);
  }

  const tailor = await User.findOne({ userId: tailorId }).lean().exec();
  if (!tailor) {
    res.status(404);
    throw new Error(`No user found for ID ${tailorId}`);
  }

  const measurer = await User.findOne({ userId: measurerId }).lean().exec();
  if (!measurer) {
    res.status(404);
    throw new Error(`No user found for ID ${measurerId}`);
  }

  // Loop through the materials array and replace materialId with the corresponding _id
  const materialsData = await Promise.all(
    materials.map(async (materialEntry) => {
      const material = await Material.findOne({
        materialId: materialEntry.material,
      })
        .lean()
        .exec();
      if (!material) {
        throw new Error(`No material found for ID ${materialEntry.material}`);
      }
      return {
        material: material._id,
        unitsNeeded: materialEntry.unitsNeeded,
      };
    })
  );

  const productData = {
    ...req.body,
    cutter: cutter._id,
    tailor: tailor._id,
    measurer: measurer._id,
    measurement: measurement?._id,
    materials: materialsData,
  };

  const newProduct = await Product.create(productData);

  const populatedProduct = await Product.findById(newProduct._id)
    .populate("cutter", "name") // Replace 'name' with the fields you want to populate
    .populate("tailor", "name")
    .populate("measurer", "name")
    .populate("materials.material")
    .lean()
    .exec();

  res.json({
    message: "New product created Successfully.",
    success: true,
    data: populatedProduct,
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
      //     path: "customer",
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
        path: "customer",
        select: "-_id -createdAt -updatedAt -__v",
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
  const { productId } = req?.params;
  const { status, measurement } = req.body;

  if (!status && !measurement) {
    res.status(400);
    throw new Error("Status or measurement required.");
  }

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  if (status) {
    // Update the status field only
    product.status = status;
  } else if (measurement) {
    product.measurement = measurement;
  }

  const updatedProduct = await product.save();

  const populatedProduct = await Product.findById(updatedProduct._id)
    .populate("cutter", "name") // Replace 'name' with the fields you want to populate
    .populate("tailor", "name")
    .populate("measurer", "name")
    .populate("measurement")
    .populate("materials.material"); // Populate materials array with material details

  res.json({
    message: "Product status updated successfully.",
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
