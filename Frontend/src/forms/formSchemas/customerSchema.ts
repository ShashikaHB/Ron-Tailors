/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import z from 'zod';

export const customerSchema = z.intersection(
  z.object({
    name: z.string().min(1, 'Customer name is required.'),
    mobile: z.string().refine((value) => /^\d{10}$/.test(value), {
      message: 'Mobile number should be exactly 10 digits',
    }),
  }),
  z.discriminatedUnion('variant', [
    z.object({ variant: z.literal('create') }),
    z.object({
      variant: z.literal('edit'),
      customerId: z.number().min(1),
    }),
  ])
);

export type CustomerSchema = z.infer<typeof customerSchema>;

export const defaultCustomerValues: CustomerSchema = {
  variant: 'create',
  mobile: '',
  name: '',
};
