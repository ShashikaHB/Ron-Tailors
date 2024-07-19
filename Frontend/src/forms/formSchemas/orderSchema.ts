import z from "zod";
import { PaymentType } from "../../enums/PaymentType";

// Create a base schema without the conditional fields
const baseOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(1, "Name is required"),
    mobile: z.string().refine((value) => /^\d{10}$/.test(value), {
      message: "Mobile number should be exactly 10 digits",
    }),
  }),
  salesPerson: z.number().min(1, "Sales person is required."),
  orderDate: z
    .date()
    .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
      message: "Order date is required and must be a valid date.",
    }),
  deliveryDate: z
    .date()
    .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
      message: "Delivery date is required and must be a valid date.",
    }),
  weddingDate: z.date().optional(),
  orderDetails: z.array(
    z.object({
      description: z.string().optional(),
      products: z.array(z.number()),
    })
  ),
  fitOnRounds: z.array(z.date()).optional(),
  totalPrice: z.coerce.number().min(1, "Total price is required."),
  subTotal: z.coerce.number().min(1, "Sub Total is required."),
  discount: z.coerce.number().optional(),
  advPayment: z.coerce.number().optional(),
  balance: z.coerce.number().optional(),
  paymentType: z.nativeEnum(PaymentType).default(PaymentType.Cash),
});

// Define the create schema with customer and salesPerson as numbers
const createOrderSchema = baseOrderSchema.extend({
  variant: z.literal("create"),
});

// Define the edit schema with customer and salesPerson as respective schemas
const editOrderSchema = baseOrderSchema.extend({
  variant: z.literal("edit"),
  orderId: z.number().min(1),
});

// Combine create and edit schemas into a discriminated union schema
export const orderSchema = z.discriminatedUnion("variant", [
  createOrderSchema,
  editOrderSchema,
]);

export type OrderSchema = z.infer<typeof orderSchema>;

// Define default values for order schema with type assertions
export const defaultOrderValues: OrderSchema = {
  variant: "create", // or 'edit' as needed
  customer: {
    name: "",
    mobile: "",
  },
  orderDate: new Date(),
  deliveryDate: new Date(),
  weddingDate: undefined,
  salesPerson: 0,
  orderDetails: [],
  fitOnRounds: [new Date()],
  totalPrice: 0,
  subTotal: 0,
  discount: 0,
  advPayment: 0,
  balance: 0,
  paymentType: PaymentType.Cash,
  // orderId is required only for 'edit' variant
};
