import { DailySummary } from "../models/dailySummaryModel.js";

export const updateDailySummary = async (transaction) => {
    const { transactionType, paymentType, amount, date, store } = transaction;
    const transactionDate = new Date(date).toISOString().split('T')[0]; // Get date without time
  
    // Find or create the daily summary for the transaction date
    let dailySummary = await DailySummary.findOne({ date: transactionDate, store: store });
  
    if (!dailySummary) {
      dailySummary = new DailySummary({ date: transactionDate, store: store });
    }
  
    // Update total income/expense and payment type-based income
    if (transactionType === 'Income') {
      dailySummary.totalIncome += amount;
  
      // Update income based on payment type
      switch (paymentType) {
        case 'Card':
          dailySummary.cardIncome += amount;
          break;
        case 'Cash':
          dailySummary.cashIncome += amount;
          break;
        case 'Bank Transfer':
          dailySummary.bankTransferIncome += amount;
          break;
        default:
          break;
      }
    } else if (transactionType === 'Expense') {
      dailySummary.totalExpense += amount;

        if (paymentType === 'Cash') {
            dailySummary.cashExpense += amount;
        }
    }
  
    // Save the updated daily summary
    await dailySummary.save();
  };