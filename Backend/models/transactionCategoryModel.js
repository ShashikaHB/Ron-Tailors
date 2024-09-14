import mongoose from 'mongoose';


const transactionCategorySchema = new mongoose.Schema(
  {
    transactionType: {
      type: String,
      enum: ['Income', 'Expense'],
      required: [true, 'Transaction type is required.'],
    },
    transactionCategory: {
        type: String,
        required: [true, 'Transaction Category is required.'],
      },
  },
  { timestamps: false }
);

export const TransactionCategory = mongoose.model('TransactionCategory', transactionCategorySchema);
