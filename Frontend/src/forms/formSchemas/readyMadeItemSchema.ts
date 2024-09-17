/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import z from 'zod';
import PaymentType from '../../enums/PaymentType';
import Stores from '../../enums/Stores';

export const readyMadeItemSchema = z.object({
  customer: z.object({
    name: z.string().min(1, 'Name is required'),
    mobile: z.string().refine((value) => /^\d{10}$/.test(value), {
      message: 'Mobile number should be exactly 10 digits',
    }),
  }),
  itemType: z.string().min(1, 'Item Type name is required.'),
  paymentType: z.nativeEnum(PaymentType),
  store: z.nativeEnum(Stores),
  price: z.coerce.number().min(1, 'Price is required'),
  salesPerson: z.number().min(1, 'Sales person is required.'),
});

export type ReadyMadeItemSchema = z.infer<typeof readyMadeItemSchema>;

export const defaultReadyMadeOrderValues: ReadyMadeItemSchema = {
  customer: {
    name: '',
    mobile: '',
  },
  itemType: '',
  paymentType: PaymentType.Cash,
  price: 0,
  store: Stores.Kegalle,
  salesPerson: 0,
};
