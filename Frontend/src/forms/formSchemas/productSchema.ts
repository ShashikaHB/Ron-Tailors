import { z } from "zod";
import { materialSchema } from "./materialsSchema";
import { ProductType } from "../../enums/ProductType";
import {
  defaultMeasurementValues,
  measurementSchema,
} from "./measurementSchema";
import { ProductStatus } from "../../enums/ProductStatus";
import { defaultUserValues, userSchema } from "./userSchema";
import { customerSchema } from "./customerSchema";

// export const productSchema = z.intersection(
//   z.object({
//     materials: z.array(
//       z.object({
//         material: materialSchema,
//         unitsNeeded: z.number().min(1, "Number of units required."),
//       })
//     ),
//     style: z.string().optional(),
//     color: z.string().optional(),
//     type: z.nativeEnum(ProductType),
//     measurement: measurementSchema,
//     cost: z.number().optional(),
//     price: z.number().min(1, "Price is required."),
//     noOfUnits: z.number().optional(),
//     status: z.nativeEnum(ProductStatus),
//     cutter: userSchema,
//     tailor: userSchema,
//     measurer: userSchema,
//     rentPrice: z.number().optional(),
//     isNewRentOut: z.boolean(),
//   }),
//   z.discriminatedUnion("variant", [
//     z.object({ variant: z.literal("create") }),
//     z.object({ variant: z.literal("edit"), productId: z.number().min(1) }),
//   ])
// );

// Define a base schema for products
const baseProductSchema = z.object({
  style: z.string().optional(),
  remarks: z.string().optional(),
  isNecessary: z.boolean().default(false),
  itemType: z.nativeEnum(ProductType),
  measurements: z.array(z.string()).min(1, "Measurements required."),
  cost: z.number().optional(),
  price: z.number().min(1, "Price is required."),
  status: z.nativeEnum(ProductStatus),
  cutter: userSchema,
  tailor: userSchema,
  measurer: userSchema,
  rentPrice: z.number().optional(),
  isNewRentOut: z.boolean(),
});

// Define the create schema with customer and salesPerson as numbers
const createProductSchema = baseProductSchema.extend({
  customer: z.number(),
  salesPerson: z.number(),
  variant: z.literal("create"),
});

// Define the edit schema with customer and salesPerson as respective schemas
const editProductSchema = baseProductSchema.extend({
  customer: customerSchema,
  salesPerson: userSchema,
  variant: z.literal("edit"),
  productId: z.number().min(1),
});

// Combine create and edit schemas into a discriminated union schema
export const productSchema = z.discriminatedUnion("variant", [
  createProductSchema,
  editProductSchema,
]);

export type ProductSchema = z.infer<typeof productSchema>;

export const defaultProductValues: ProductSchema = {
  variant: "create",
  materials: [],
  color: "",
  style: "",
  type: ProductType.Coat,
  measurement: defaultMeasurementValues,
  cost: 0,
  price: 0,
  noOfUnits: 0,
  status: ProductStatus.NotStarted,
  cutter: defaultUserValues,
  tailor: defaultUserValues,
  measurer: defaultUserValues,
  rentPrice: 0,
  isNewRentOut: false,
};
