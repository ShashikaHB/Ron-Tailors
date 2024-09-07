/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { z } from 'zod';

export const piecePricesSchema = z.object({
  type: z.enum(['Cutting', 'Tailoring']),
  Shirt: z.coerce.number().min(0, 'Shirt price is required'),
  Trouser: z.coerce.number().min(0, 'Trouser price is required'),
  Coat: z.coerce.number().min(0, 'Coat price is required'),
  WestCoat: z.coerce.number().min(0, 'West Coat price is required'),
  Cravat: z.coerce.number().min(0, 'Cravat price is required'),
  Bow: z.coerce.number().min(0, 'Bow price is required'),
  Tie: z.coerce.number().min(0, 'Tie price is required'),
});

export type PiecePricesSchema = z.infer<typeof piecePricesSchema>;

export const defaultPiecePricesValues: PiecePricesSchema = {
  type: 'Cutting', // default type, could be 'Cutting' or 'Tailoring'
  Shirt: 0,
  Trouser: 0,
  Coat: 0,
  WestCoat: 0,
  Cravat: 0,
  Bow: 0,
  Tie: 0,
};
