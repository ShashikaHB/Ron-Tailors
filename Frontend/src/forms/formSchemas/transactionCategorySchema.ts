/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { z } from 'zod';

export const transactionCategorySchema = z.object({
  transactionType: z.string().min(1, 'Transaction Type is required.'),
  transactionCategory: z.string().min(1, 'Transaction category is required.'),
});

export type TransactionCategorySchema = z.infer<typeof transactionCategorySchema>;

export const defaultTransactionCategoryValues: TransactionCategorySchema = {
  transactionType: '0',
  transactionCategory: '',
};
