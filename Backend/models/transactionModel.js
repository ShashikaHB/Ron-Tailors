import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const transactionSchema = new mongoose.Schema(
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
    paymentType: {
        type: String,
        enum: ['Cash', 'Card', 'Bank Transfer'],
        required: [true, 'Payment type is required.'],
      },
    date: {
        type: Date,
        default: new Date()
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required.'],
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
    },
    salesPerson: {
        type: String,
        required: [true, 'Sales Person is required.'],
    }
  },
  { timestamps: true }
);

transactionSchema.plugin(AutoIncrement, {
  inc_field: 'transactionId',
  id: 'transactions',
  start_seq: 1,
});

export const Transaction = mongoose.model('Transaction', transactionSchema);
