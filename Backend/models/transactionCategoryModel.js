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
        unique: [true, 'Transaction Category already exists']
      },
    isPrimary: {
        type: Boolean
    }
  },
  { timestamps: false }
);

export const TransactionCategory = mongoose.model('TransactionCategory', transactionCategorySchema);
