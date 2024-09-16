import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";
import { WorkLog } from "../models/workLogModel.js";
import { getDocId } from "../utils/docIds.js";

export const logWork = async (
  user,
  action,
  pieceType,
  productId,
  piecePrice
) => {
  if (!user) return;

  const productDoc = await Product.findOne({productId}).lean().exec()

  const workLog = await WorkLog.create({
    user,
    action,
    pieceType,
    productId: productDoc._id,
    piecePrice, // Store the piece price
  });

  if (!workLog) {
    throw new Error("Internal server Error!");
  }
};
