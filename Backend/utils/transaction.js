import { Transaction } from "../models/transactionModel.js";

export const addOrEditTransaction = async (data) => {
  const { description, isInitialTransaction } = data;

  const transactionFiler = {
    description,
    isInitialTransaction: isInitialTransaction ? true : false,
  };

  try {
    let transaction = await Transaction.findOne(transactionFiler);

    if (!transaction) {
      transaction = await Transaction.create({
        ...data,
      });

      if (!transaction) {
        throw new Error("Error adding transaction");
      }
    } else {
      transaction = await Transaction.findOneAndUpdate(
        {
          description,
          isInitialTransaction: isInitialTransaction ? true : false,
        },
        { ...data },
        { new: true }
      );
      await transaction.save();
    }

    return transaction;
  } catch (error) {
    throw new Error(`Error adding or editing transaction: ${error.message}`);
  }
};
