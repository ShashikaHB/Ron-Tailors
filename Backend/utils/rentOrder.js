import { RentItem } from "../models/rentItemModel.js";
import { RentOrder } from "../models/rentOrderModel.js";

export const deleteRentOrder = async (rentOrderId) => {
  const rentOrder = await RentOrder.findOne({ rentOrderId });

  if (!rentOrder) {
    throw new Error(`No rent order found for Rent order ID: ${rentOrderId}`);
  }

  for (const detail of rentOrder.rentOrderDetails) {
    const updatedItem = await RentItem.findOneAndUpdate(
      {
        rentItemId: detail.rentItemId,
      },
      {
        status: "Available",
      },
      {
        new: true,
      }
    );
  }

  const deletedRentOrder = await RentOrder.findOneAndDelete({ rentOrderId });

  return deletedRentOrder;
};
