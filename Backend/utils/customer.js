import { Customer } from "../models/customerModel.js";

export const addOrFetchCustomer = async ({ name, mobile }) => {
  try {
    let customer = await Customer.findOne({ mobile });

    if (!customer) {
      customer = new Customer({
        name,
        mobile,
      });
      await customer.save();
    }

    if (customer.name !== name) {
      customer.name = name;
      await customer.save();
    }

    return customer;
  } catch (error) {
    throw new Error(`Error adding or fetching customer: ${error.message}`);
  }
};
