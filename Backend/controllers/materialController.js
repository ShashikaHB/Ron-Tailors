import { generateToken } from "../config/jwtToken.js";
import { Material } from "../models/materialModel.js";
import asyncHandler from "express-async-handler";

export const createMaterial = asyncHandler(async (req, res) => {
  const brand = req.body.brand;

  const materialExists = await Material.findOne({ brand });

  if (!materialExists) {
    const newMaterial = await Material.create(req.body);
    res.json({
      message: "New material created",
      success: true,
      data: newMaterial,
    });
  } else {
    throw new Error("Material already exists.");
  }
});

export const getAllMaterials = asyncHandler(async (req, res) => {
  try {
    const getMaterials = await Material.find();
    res.json({
      message: "All materials fetched.",
      success: true,
      data: getMaterials,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const getSingleMaterial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getMaterial = await Material.findById(id);
    res.json({
      message: "Material fetched.",
      success: true,
      data: getMaterial,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const updateMaterial = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const updatedMaterial = await Material.findByIdAndUpdate(
      id,
      {
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
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteMaterial = asyncHandler(async (req, res) => {
  const { id } = req.params;

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
