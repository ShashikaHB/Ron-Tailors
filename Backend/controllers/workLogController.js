import { WorkLog } from "../models/workLogModel.js";

export const logWork = async (
  user,
  action,
  pieceType,
  productId,
  piecePrice
) => {
  if (!user) return;

  const workLog = await WorkLog.create({
    user,
    action,
    pieceType,
    productId,
    piecePrice, // Store the piece price
  });

  if (!workLog) {
    throw new Error("Internal server Error!");
  }
};
