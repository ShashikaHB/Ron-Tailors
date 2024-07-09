import z from "zod";
import { customerSchema, defaultCustomerValues } from "./customerSchema";
import { defaultUserValues, userSchema } from "./userSchema";
import { productSchema } from "./productSchema";
import { PaymentType } from "../../enums/PaymentType";
import { ProductType } from "../../enums/ProductType";

// Create a base schema without the conditional fields
const baseOrderSchema = z.object({
  style: z.string().optional(),
  remarks: z.string().optional(),
  isNecessary: z.boolean().default(false),
  orderDate: z.date(),
  deliveryDate: z.date(),
  weddingDate: z.date().optional(),
  itemType: z.nativeEnum(ProductType),
  measurements: z.array(z.string()).min(1, "Measurements required."),
  orderDetails: z.array(
    z.object({
      description: z.string().optional(),
      products: z.array(productSchema),
    })
  ),
  fitOnRounds: z.array(z.date()).min(1, "Fit on rounds are required."),
  totalPrice: z.number().min(1, "Total price is required."),
  subTotal: z.number().min(1, "Sub Total is required."),
  discount: z.number().optional(),
  advPayment: z.number().optional(),
  balance: z.number().optional(),
  paymentType: z.nativeEnum(PaymentType).default(PaymentType.Cash),
});

// Define the create schema with customer and salesPerson as numbers
const createOrderSchema = baseOrderSchema.extend({
  customer: z.object({
    name: z.string().min(1, "Name is required"),
    mobile: z.string().refine((value) => /^\d{10}$/.test(value), {
      message: "Mobile number should be exactly 10 digits",
    }),
  }),
  salesPerson: z.number(),
  variant: z.literal("create"),
});

// Define the edit schema with customer and salesPerson as respective schemas
const editOrderSchema = baseOrderSchema.extend({
  customer: customerSchema,
  salesPerson: userSchema,
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
  style: "",
  remarks: "",
  isNecessary: false,
  orderDate: new Date(),
  deliveryDate: new Date(),
  weddingDate: undefined,
  itemType: ProductType.Coat,
  measurements: [],
  salesPerson: 112,
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
