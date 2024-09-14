import { Material } from "../models/materialModel.js";
import asyncHandler from "express-async-handler";
import { getDocId } from "../utils/docIds.js";

export const createMaterial = asyncHandler(async (req, res) => {
  const brand = req.body.brand;
  const name = req.body.name;
  const store = req.body.store;

  const materialExists = await Material.findOne({ brand, name, store }).lean().exec();

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

  if (!materialId) {
    throw new Error("No material Id found")
  }

  const materialDocId = await getDocId(Material, "materialId", materialId)

  try {
    const deleteMaterial = await Material.findByIdAndDelete(materialDocId);
    if (!deleteMaterial) {
        throw new Error('Material deletion failed.')
    }
    res.json({
      message: "Material Deleted Successfully.",
      success: true,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const deductMaterialUnits = async (materials) => {
    await Promise.all(
      materials.map(async ({ material: materialId, unitsNeeded }) => {
        const material = await Material.findOne({ materialId }).exec();
        
        if (!material) {
          throw new Error(`Material with ID ${materialId} not found.`);
        }
  
        // Check if there are enough units
        if (material.noOfUnits < unitsNeeded) {
          throw new Error(`Insufficient units for material ID ${materialId}. Available: ${material.noOfUnits}, Needed: ${unitsNeeded}`);
        }
  
        // Deduct units
        material.noOfUnits -= unitsNeeded;
  
        // Save the updated material
        await material.save();
      })
    );
  };
