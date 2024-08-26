import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: Number,
      unique: true,
    },
    type: {
      type: String,
      enum: ['Credit', 'Debit'],
      required: [true, 'Transaction type is required.'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required.'],
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
    },
  },
  { timestamps: true }
);

transactionSchema.plugin(AutoIncrement, {
  inc_field: 'transactionId',
  id: 'transactions',
  start_seq: 1,
});

export const Transaction = mongoose.model('Transaction', transactionSchema);
