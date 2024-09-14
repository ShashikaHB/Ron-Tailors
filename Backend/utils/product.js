import { Material } from "../models/materialModel.js";
import { User } from "../models/userModel.js";

export const fetchUserById = async (userId, role) => {
    const user = await User.findOne({ userId }).lean().exec();
    if (!user) {
      throw new Error(`No ${role} found for ID ${userId}`);
    }
    return user;
  };

export const fetchMaterialById = async (materialId) => {
    const material = await Material.findOne({ materialId }).lean().exec();
    if (!material) {
      throw new Error(`No material found for ID ${materialId}`);
    }
    return material;
  };