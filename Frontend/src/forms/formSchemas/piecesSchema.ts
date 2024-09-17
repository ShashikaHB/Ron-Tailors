/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { z } from 'zod';

// Zod schema for Product Types specific to General
const ProductType = z.enum([
  'Coat',
  'National Coat',
  'West Coat',
  'Shirt',
  'Trouser',
  'Designed Trouser',
  'Designed Shirt',
  'National Shirt',
  'Rent Coat',
  'Rent West Coat',
  'Sarong',
  'Tie',
  'Bow',
  'Cravat',
  'Hanky',
  'Chain',
]);

// Zod schema for Item (defining the structure of each item in the General category)
const itemSchema = z.object({
  itemType: ProductType,
  cuttingPrice: z.coerce.number().min(0, 'Cutting price must be non-negative.'),
  tailoringPrice: z.coerce.number().min(0, 'Tailoring price must be non-negative.'),
});

// Zod schema for the entire structure containing only items (related to General)
export const piecePricesSchema = z.object({
  items: z.array(itemSchema),
});

// Infer the TypeScript types from the schema
export type PiecePricesSchema = z.infer<typeof piecePricesSchema>;

// Helper function to create default items with initial prices
const createDefaultItems = (
  itemTypes: z.infer<typeof ProductType>[]
): Array<{
  itemType: z.infer<typeof ProductType>;
  cuttingPrice: number;
  tailoringPrice: number;
}> => {
  return itemTypes.map((itemType) => ({
    itemType,
    cuttingPrice: 0, // Default cutting price
    tailoringPrice: 0, // Default tailoring price
  }));
};

// Default values for piece prices (General items only)
export const defaultPiecePrices: PiecePricesSchema = {
  items: createDefaultItems([
    'Coat',
    'National Coat',
    'West Coat',
    'Shirt',
    'Trouser',
    'Designed Trouser',
    'Designed Shirt',
    'National Shirt',
    'Rent Coat',
    'Rent West Coat',
    'Sarong',
    'Tie',
    'Bow',
    'Cravat',
    'Hanky',
    'Chain',
  ]),
};
