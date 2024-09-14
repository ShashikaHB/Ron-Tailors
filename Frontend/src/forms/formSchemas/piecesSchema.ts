/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { z } from 'zod';

// Zod schema for Product Types
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

// Zod schema for Item (defining the structure of each item)
const itemSchema = z.object({
  itemType: ProductType,
  cuttingPrice: z.coerce.number().min(0, 'Cutting price must be non-negative.'),
  tailoringPrice: z.coerce.number().min(0, 'Tailoring price must be non-negative.'),
});

// Zod schema for Category with items (define items as an array)
const categorySchema = z.object({
  category: z.enum(['Full Suit', 'National Suit', 'Rent Full Suit', 'General']),
  items: z.array(itemSchema),
});

// Zod schema for the entire structure
export const piecePricesSchema = z.object({
  categories: z.array(categorySchema),
});
// Infer the TypeScript types from the schema
export type PiecePricesSchema = z.infer<typeof piecePricesSchema>;

// Helper function to create default items with initial prices for a category
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

// Default values for piece prices (with all categories and their item types)
export const defaultPiecePrices: PiecePricesSchema = {
  categories: [
    {
      category: 'Full Suit',
      items: createDefaultItems(['Coat', 'Shirt', 'Trouser', 'West Coat', 'Cravat', 'Bow', 'Tie', 'Hanky']),
    },
    {
      category: 'National Suit',
      items: createDefaultItems(['National Coat', 'National Shirt', 'Sarong', 'Trouser', 'Hanky']),
    },
    {
      category: 'Rent Full Suit',
      items: createDefaultItems(['Rent Coat', 'Shirt', 'Trouser', 'Rent West Coat', 'Cravat', 'Bow', 'Tie', 'Hanky']),
    },
    {
      category: 'General',
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
    },
  ],
};
