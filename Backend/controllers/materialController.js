import { Material } from "../models/materialModel.js";
import asyncHandler from "express-async-handler";

export const createMaterial = asyncHandler(async (req, res) => {
  const brand = req.body.brand;
  const type = req.body.type;

  const materialExists = await Material.findOne({ brand, type }).lean().exec();

  if (!materialExists) {
    const newMaterial = await Material.create(req.body);
    res.json({
      message: "New material created",
      success: true,
    });
  } else {
    throw new Error("Material already exists.");
  }
});

export const getAllMaterials = asyncHandler(async (req, res) => {
  try {
    const allMaterials = await Material.find().lean();
    res.json({
      message: "All materials fetched.",
      success: true,
      data: allMaterials,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const getSingleMaterial = asyncHandler(async (req, res) => {
  const { materialId } = req.params;

  if (!materialId) {
    res.status(404);
    throw new Error("Material Id not found");
  }

  const singleMaterial = await Material.findOne({ materialId })
    .select("-_id -__v -createdAt -updatedAt")
    .lean()
    .exec();

  if (!singleMaterial) {
    res.status(404);
    throw new Error("Material not found!");
  }
  res.json({
    message: "Material fetched.",
    success: true,
    data: singleMaterial,
  });
});

export const updateMaterial = asyncHandler(async (req, res) => {
  const { materialId } = req.params;

  const material = await Material.findOne({ materialId }).lean().exec();

  if (!material) {
    res.status(404);
    throw new Error("No material found to update.");
  }

  const updatedMaterial = await Material.findByIdAndUpdate(
    material._id,
    {
      name: req?.body?.name,
      color: req?.body?.color,
      brand: req?.body?.brand,
      unitPrice: req?.body?.unitPrice,
      noOfUnits: req?.body?.noOfUnits,
      marginPercentage: req?.body?.marginPercentage,
      type: req?.body?.type,
    },
    {
      new: true,
    }
  );
  res.json({
    message: "Material updated.",
    success: true,
    data: updatedMaterial,
  });
});

export const deleteMaterial = asyncHandler(async (req, res) => {
  const { materialId } = req.params;

  try {
    const deleteMaterial = await Material.findByIdAndDelete(id);
    res.json({
      message: "Material Deleted Successfully.",
      success: true,
    });
  } catch (error) {
    throw new Error(error);
  }
});
