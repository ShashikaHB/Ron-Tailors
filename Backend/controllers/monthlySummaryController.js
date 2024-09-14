import { MonthlySummary } from "../models/monthlySummaryModel.js";
import { PiecePrices } from "../models/piecePriceModel.js";

export const updateUserSummaryWithPieceType = async (userId, month, itemType, actionType) => {
    // Find the monthly summary for the user
    const summary = await MonthlySummary.findOne({ user: userId, month });
  
    if (!summary) {
      // If no summary exists, create one
      const newSummary = new MonthlySummary({
        user: userId,
        month: month,
      });
      
      await newSummary.save();
    }
  
    // Determine if the action is "Cutting" or "Tailoring"
    if (actionType === "Cutting Done") {
      // Check if the itemType already exists in the piecesCut array
      const existingCutPiece = summary.pieceTypesCut.find(p => p.itemType === itemType);
      if (existingCutPiece) {
        // If it exists, increment the count
        existingCutPiece.count += 1;
      } else {
        // If not, push a new entry for the itemType
        summary.pieceTypesCut.push({ itemType, count: 1 });
      }
  
      summary.piecesCut += 1;  // Update total pieces cut
    } else if (actionType === "Tailoring Done") {
      // Check if the itemType already exists in the piecesTailored array
      const existingTailoredPiece = summary.pieceTypesTailored.find(p => p.itemType === itemType);
      if (existingTailoredPiece) {
        // If it exists, increment the count
        existingTailoredPiece.count += 1;
      } else {
        // If not, push a new entry for the itemType
        summary.pieceTypesTailored.push({ itemType, count: 1 });
      }
  
      summary.piecesTailored += 1;  // Update total pieces tailored
    }
  
    // Calculate salary if necessary (based on the piece prices)
    const piecePrice = await PiecePrices.findOne({ "items.itemType": itemType });
    if (actionType === "Cutting Done") {
      summary.totalSalary += piecePrice?.items.find(item => item.itemType === itemType)?.cuttingPrice || 0;
    } else if (actionType === "Tailoring Done") {
      summary.totalSalary += piecePrice?.items.find(item => item.itemType === itemType)?.tailoringPrice || 0;
    }
  
    // Save the updated summary
    await summary.save();
  };