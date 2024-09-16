/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { z } from 'zod';
import ProductType, { ProductCategory } from '../../enums/ProductType';
import { ProductStatus } from '../../enums/ProductStatus';

export const productSchema = z.intersection(
  z.object({
    materials: z.array(
      z
        .object({
          material: z.string(),
          unitsNeeded: z.number(),
        })
        .optional()
    ),
    color: z.string().optional(),
    itemType: z.nativeEnum(ProductType),
    measurement: z.union([z.number(), z.undefined()]),
    itemCategory: z.nativeEnum(ProductCategory).optional(),
    size: z.coerce.number().optional(),
    price: z.coerce.number().min(1, 'Price is required.'),
    noOfUnits: z.number().optional(),
    status: z.nativeEnum(ProductStatus),
    cutter: z.number(),
    tailor: z.number(),
    measurer: z.number(),
    rentPrice: z.coerce.number().optional(),
    isNewRentOut: z.boolean(),
  }),
  z.discriminatedUnion('variant', [
    z.object({ variant: z.literal('create') }),
    z.object({
      variant: z.literal('edit'),
      productId: z.number().min(1),
    }),
  ])
);

// // Define a base schema for products
// const baseProductSchema = z.object({
//   style: z.string().optional(),
//   remarks: z.string().optional(),
//   isNecessary: z.boolean().default(false),
//   itemType: z.nativeEnum(ProductType),
//   materials: z.array(
//     z.object({ materialId: z.number(), unitsNeeded: z.number() })
//   ),
//   measurements: z.array(z.string()).min(1, "Measurements required."),
//   cost: z.number().optional(),
//   price: z.number().min(1, "Price is required."),
//   status: z.nativeEnum(ProductStatus),
//   cutter: z.number(),
//   tailor: z.number(),
//   measurer: z.number(),
//   salesPerson: z.number(),
//   rentPrice: z.number().optional(),
//   isNewRentOut: z.boolean(),
// });

// // Define the create schema with customer and salesPerson as numbers
// const createProductSchema = baseProductSchema.extend({
//   variant: z.literal("create"),
// });

// // Define the edit schema with customer and salesPerson as respective schemas
// const editProductSchema = baseProductSchema.extend({
//   variant: z.literal("edit"),
//   productId: z.number().min(1),
// });

// // Combine create and edit schemas into a discriminated union schema
// export const productSchema = z.discriminatedUnion("variant", [
//   createProductSchema,
//   editProductSchema,
// ]);

export type ProductSchema = z.infer<typeof productSchema>;

export const defaultProductValues: ProductSchema = {
  variant: 'create',
  materials: [],
  color: '',
  style: '',
  type: ProductType.Coat,
  measurement: 0,
  cost: 0,
  price: 0,
  noOfUnits: 1,
  status: ProductStatus.NotStarted,
  cutter: 0,
  tailor: 0,
  measurer: 0,
  rentPrice: 0,
  isNewRentOut: false,
};
