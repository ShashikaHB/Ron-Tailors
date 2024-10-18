/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import z from 'zod';
import PaymentType from '../../enums/PaymentType';
import Stores from '../../enums/Stores';
import ProductType from '../../enums/ProductType';

// Create a base schema without the conditional fields
const baseOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(1, 'Name is required'),
    mobile: z.string().refine((value) => !value || /^\d{10}$/.test(value), {
      message: 'Mobile number should be exactly 10 digits',
    }),
    secondaryMobile: z
      .string()
      .refine((value) => !value || /^\d{10}$/.test(value), {
        message: 'Mobile number should be exactly 10 digits',
      })
      .optional()
      .default(''),
    otherMobile: z
      .string()
      .refine((value) => !value || /^\d{10}$/.test(value), {
        message: 'Mobile number should be exactly 10 digits',
      })
      .optional()
      .default(''), // Default to empty string if not provided
  }),
  store: z.nativeEnum(Stores).default(Stores.Kegalle),
  salesPerson: z.number().min(1, 'Sales person is required.'),
  orderDate: z.date().refine((date) => date instanceof Date && !Number.isNaN(date.getTime()), {
    message: 'Order date is required and must be a valid date.',
  }),
  deliveryDate: z.date().refine((date) => date instanceof Date && !Number.isNaN(date.getTime()), {
    message: 'Delivery date is required and must be a valid date.',
  }),
  weddingDate: z
    .union([
      z.date().refine((date) => date instanceof Date && !Number.isNaN(date.getTime()), {
        message: 'Wedding date must be a valid date.',
      }),
      z.null(),
    ])
    .optional(),
  orderDetails: z.array(
    z.object({
      description: z.string().optional(),
      category: z.string().optional(),
      products: z.array(z.number()),
      rentItems: z.array(
        z.object({
          color: z.string().optional(),
          size: z.union([z.coerce.number(), z.undefined()]),
          description: z.string().optional(),
          handLength: z.string().optional(),
          notes: z.string().optional(),
          itemType: z.nativeEnum(ProductType),
          rentItemId: z.number().min(1),
          amount: z.number().optional(),
        })
      ),
      amount: z.number().min(1),
    })
  ),
  totalPrice: z.coerce.number().min(1, 'Total price is required.'),
  subTotal: z.coerce.number().min(1, 'Sub Total is required.'),
  discount: z.coerce.number().optional(),
  advPayment: z.coerce
    .number()
    .optional()
    .refine((value) => !Number.isNaN(value), {
      message: 'This field must be a valid number',
    }),
  balance: z.coerce.number().optional(),
  paymentType: z.nativeEnum(PaymentType).default(PaymentType.Cash),
});

// Define the create schema with customer and salesPerson as numbers
const createOrderSchema = baseOrderSchema.extend({
  variant: z.literal('create'),
});

// Define the edit schema with customer and salesPerson as respective schemas
const editOrderSchema = baseOrderSchema.extend({
  variant: z.literal('edit'),
  salesOrderId: z.string().min(1),
});

// Combine create and edit schemas into a discriminated union schema
export const orderSchema = z.discriminatedUnion('variant', [createOrderSchema, editOrderSchema]);

export type OrderSchema = z.infer<typeof orderSchema>;

// Define default values for order schema with type assertions
export const defaultOrderValues: OrderSchema = {
  variant: 'create', // or 'edit' as needed
  customer: {
    name: '',
    mobile: '',
    secondaryMobile: '',
    otherMobile: '',
  },
  store: Stores.Kegalle,
  orderDate: new Date(),
  deliveryDate: new Date(),
  weddingDate: null,
  salesPerson: 0,
  orderDetails: [],
  totalPrice: 0,
  subTotal: 0,
  discount: 0,
  advPayment: 0,
  balance: 0,
  paymentType: PaymentType.Cash,
  // rentOrderId is required only for 'edit' variant
};
