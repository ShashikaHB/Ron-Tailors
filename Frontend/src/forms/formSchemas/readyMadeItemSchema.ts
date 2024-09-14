/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import z from 'zod';
import PaymentType from '../../enums/PaymentType';

export const readyMadeItemSchema = z.object({
  itemType: z.string().min(1, 'Item Type name is required.'),
  paymentType: z.nativeEnum(PaymentType),
  price: z.coerce.number().min(1, 'Price is required'),
  salesPerson: z.number().min(1, 'Sales person is required.'),
});

export type ReadyMadeItemSchema = z.infer<typeof readyMadeItemSchema>;

export const defaultReadyMadeOrderValues: ReadyMadeItemSchema = {
  itemType: '',
  paymentType: PaymentType.Cash,
  price: 0,
  salesPerson: 0,
};
