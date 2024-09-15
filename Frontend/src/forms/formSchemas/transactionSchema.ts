/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { z } from 'zod';
import PaymentType from '../../enums/PaymentType';
import Stores from '../../enums/Stores';

export const transactionSchema = z.object({
  transactionType: z.string().min(1, 'Transaction Type is required.'),
  transactionCategory: z.string().min(1, 'Transaction category is required.'),
  description: z.string().min(1, 'Transaction category is required.'),
  salesPerson: z.number().min(1, 'Sales person is required.'),
  store: z.nativeEnum(Stores).default(Stores.Kegalle),
  amount: z.coerce.number().min(1, 'Transaction amount is required.'),
  date: z.date().refine((date) => date instanceof Date && !Number.isNaN(date.getTime()), {
    message: 'Date is required and must be a valid date.',
  }),
  paymentType: z.nativeEnum(PaymentType),
});

export type TransactionSchema = z.infer<typeof transactionSchema>;

export const defaultTransactionValues: TransactionSchema = {
  transactionType: '',
  transactionCategory: '',
  description: '',
  salesPerson: 0,
  store: Stores.Kegalle,
  amount: 0,
  date: new Date(),
  paymentType: PaymentType.Cash,
};
