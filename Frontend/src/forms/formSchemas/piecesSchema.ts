/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { z } from 'zod';

// Schema for each item type inside a category
const itemSchema = z.object({
  itemType: z.string(),
  cuttingPrice: z.coerce.number().min(0, 'Cutting price is required and must be a positive number'),
  tailoringPrice: z.coerce.number().min(0, 'Tailoring price is required and must be a positive number'),
});

// Schema for each category containing multiple items
const categorySchema = z.object({
  category: z.string(),
  items: z.array(itemSchema),
});

// Main schema that represents the entire response
export const piecePricesResponseSchema = z.array(categorySchema);

export type PiecePricesResponseSchema = z.infer<typeof piecePricesResponseSchema>;
