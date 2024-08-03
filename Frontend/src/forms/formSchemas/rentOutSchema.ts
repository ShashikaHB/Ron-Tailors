/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import z from 'zod';
import PaymentType from '../../enums/PaymentType';
import ProductType from '../../enums/ProductType';
import StakeOptions from '../../enums/StakeOptions';

// Create a base schema without the conditional fields
const baseRentOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(1, 'Name is required'),
    mobile: z.string().refine((value) => /^\d{10}$/.test(value), {
      message: 'Mobile number should be exactly 10 digits',
    }),
  }),
  salesPerson: z.number().min(1, 'Sales person is required.'),
  rentDate: z.date().refine((date) => date instanceof Date && !Number.isNaN(date.getTime()), {
    message: 'Rent Date is required and must be a valid Date',
  }),
  returnDate: z.date().refine((date) => date instanceof Date && !Number.isNaN(date.getTime()), {
    message: 'Delivery date is required and must be a valid date.',
  }),
  type: z.nativeEnum(ProductType),
  rentOrderDetails: z.array(
    z.object({
      productId: z.union([z.coerce.number(), z.undefined()]),
      color: z.string().optional(),
      size: z.union([z.coerce.number(), z.undefined()]),
      description: z.string().optional(),
      handLength: z.string().optional(),
      notes: z.string().optional(),
      amount: z.coerce.number().min(1, 'Price is required.'),
    })
  ),
  totalPrice: z.coerce.number().min(1, 'Total price is required.'),
  subTotal: z.coerce.number().min(1, 'Sub Total is required.'),
  discount: z.coerce.number().optional(),
  advPayment: z.coerce.number().optional(),
  balance: z.coerce.number().optional(),
  paymentType: z.nativeEnum(PaymentType).default(PaymentType.Cash),
  stakeOption: z.nativeEnum(StakeOptions),
});

// Define the create schema with customer and salesPerson as numbers
const createRentOrderSchema = baseRentOrderSchema.extend({
  variant: z.literal('create'),
});

// Define the edit schema with customer and salesPerson as respective schemas
const editRentOrderSchema = baseRentOrderSchema.extend({
  variant: z.literal('edit'),
  rentOrderId: z.number().min(1),
});

// Combine create and edit schemas into a discriminated union schema
export const rentOrderSchema = z.discriminatedUnion('variant', [createRentOrderSchema, editRentOrderSchema]);

export type RentOrderSchema = z.infer<typeof rentOrderSchema>;

// Define default values for order schema with type assertions
export const defaultRentOrderValues: RentOrderSchema = {
  variant: 'create', // or 'edit' as needed
  customer: {
    name: '',
    mobile: '',
  },
  rentDate: new Date(),
  returnDate: new Date(),
  salesPerson: 0,
  type: ProductType.Coat,
  rentOrderDetails: [],
  totalPrice: 0,
  subTotal: 0,
  discount: 0,
  advPayment: 0,
  balance: 0,
  paymentType: PaymentType.Cash,
  stakeOption: StakeOptions.Deposit,
  // orderId is required only for 'edit' variant
};