import { RentItem } from "../models/rentItemModel.js";
import { RentOrder } from "../models/rentOrderModel.js";

export const createRentOrderAndItem = async (product, salesOrder, store) => {
  // Create RentItem
  const rentItem = await RentItem.create({
    rentItemId: `${salesOrder.salesOrderId}-${product.itemType}-${product.productId}`,
    color: product.color,
    size: product.size,
    description: `New RentOut: ${product.itemType}`,
    store: store,
    itemCategory: product.itemCategory,
    itemType: product.itemType,
    status: "Rented",
    isNewRentOut: true,
  });

  // Create RentOrder
  const rentOrder = await RentOrder.create({
    customer: salesOrder.customer,
    store: salesOrder.store,
    rentDate: new Date(),
    returnDate: new Date(), // Modify return date logic if needed
    rentOrderDetails: [
      {
        description: `New RentOut: ${product.itemType}`,
        color: product.color,
        size: product.size,
        rentItemId: rentItem.rentItemId,
        itemCategory: product.itemCategory,
        itemType: product.itemType,
        amount: product.rentPrice || 0,
        status: "Rented",
      },
    ],
    salesPerson: salesOrder.salesPerson._id,
    totalPrice: product.rentPrice || 0,
    subTotal: product.rentPrice || 0,
    paymentType: salesOrder.paymentType,
    isNewRentOut: true
  });

  return { rentItem, rentOrder };
};

export const deleteRentOrderAndItem = async (product, salesOrderId) => {
  // Find RentItem and RentOrder based on product
  const rentItem = await RentItem.findOneAndDelete({
    rentItemId: `${salesOrderId}-${product.itemType}-${product.productId}`,
  });
  if (!rentItem) {
    throw new Error(`RentItem not found for product ${product.productId}`);
  }

  const rentOrder = await RentOrder.findOneAndUpdate(
    { "rentOrderDetails.rentItemId": rentItem.rentItemId },
    { $pull: { rentOrderDetails: { rentItemId: rentItem.rentItemId } } },
    { new: true }
  );

  // If RentOrder has no more details, delete it
  if (rentOrder && rentOrder.rentOrderDetails.length === 0) {
    await RentOrder.findByIdAndDelete(rentOrder._id);
  }

  return { rentItem, rentOrder };
};
