/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { z } from 'zod';

export const materialSchema = z.intersection(
  z.object({
    name: z.string().min(1, 'Material name is required.'),
    color: z.string().min(1, 'Material color is required.'),
    unitPrice: z.coerce.number().min(1, 'Unit price is required.'),
    noOfUnits: z.coerce.number().min(1, 'Number of units is required.'),
    marginPercentage: z.coerce.number().min(1, 'Margin percentage is required.'),
    brand: z.string().min(1, 'Material color is required.'),
    type: z.string(),
  }),
  z.discriminatedUnion('variant', [
    z.object({ variant: z.literal('create') }),
    z.object({
      variant: z.literal('edit'),
      materialId: z.number().min(1),
    }),
  ])
);

export type MaterialSchema = z.infer<typeof materialSchema>;

export const defaultMaterialValues: MaterialSchema = {
  variant: 'create',
  name: '',
  color: '',
  unitPrice: 0,
  noOfUnits: 0,
  marginPercentage: 0,
  brand: '', // Optional field, provide an empty string or another appropriate default value
  type: '', // Optional field, provide an empty string or another appropriate default value
};
