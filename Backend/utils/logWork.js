import { PiecePrices } from "../models/piecePriceModel.js";
import { WorkLog } from "../models/workLogModel.js";

const piecePrices = {
    Shirt: 50, // $50 per Shirt
    Trouser: 60, // $60 per Trouser
    Coat: 100, // $100 per Coat
    'West Coat': 80, // $80 per West Coat
    Cravat: 20, // $20 per Cravat
    Bow: 15, // $15 per Bow
    Tie: 10, // $10 per Tie
  };

export const logWork = async (user, action, pieceType, productId) => {
    return
    if (!user) return;
  
    // Find the existing work log for this product, if any
    let workLog = await WorkLog.findOne({ user: user._id, productId });
  
    // const piecePrice = piecePrices[pieceType]; // Get the price for the piece type
    const piecePrice = await PiecePrices.findOne({ pieceType: pieceType }).lean();
  
    if (workLog) {
      // If a log exists and the action is "Cutting Done" or "Tailoring Done", update it
      if (action === "Cutting Done" || action === "Tailoring Done") {
        workLog.action = action;
        workLog.completed = true; // Mark as completed
        workLog.piecePrice = piecePrice; // Update piece price
        await workLog.save();
      }
    } else {
      // If no log exists, create a new one
      workLog = new WorkLog({
        user: user._id,
        action,
        pieceType,
        productId,
        completed: action.includes("Done"), // Mark as completed if the action indicates completion
        piecePrice, // Store the piece price
      });
      await workLog.save();
    }
  };
  