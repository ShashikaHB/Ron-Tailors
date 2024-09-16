/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { z } from 'zod';
import ProductType from '../../enums/ProductType';
import { RentItemStatus } from '../../enums/RentItemDetails';

export const rentItemSchema = z.intersection(
  z.object({
    color: z.string().optional(),
    size: z.union([z.coerce.number(), z.null()]),
    description: z.string().optional(),
    itemType: z.nativeEnum(ProductType),
  }),
  z.discriminatedUnion('variant', [
    z.object({ variant: z.literal('create') }),
    z.object({
      variant: z.literal('edit'),
      rentItemId: z.number().min(1),
      status: z.nativeEnum(RentItemStatus),
    }),
  ])
);

export type RentItemSchema = z.infer<typeof rentItemSchema>;

export const defaultRentItemValues: RentItemSchema = {
  variant: 'create',
  color: '',
  size: null,
  type: ProductType.Coat,
  description: '',
};
