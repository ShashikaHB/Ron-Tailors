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
    user: user._id,
    action,
    pieceType,
    productId,
    piecePrice, // Store the piece price
  });
};
