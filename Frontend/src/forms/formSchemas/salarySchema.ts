/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { z } from 'zod';

export const salarySchema = z.object({
  salesPerson: z.object({
    gradeA: z.coerce.number().min(1, 'Grade A salary is required.'),
    gradeB: z.coerce.number().min(1, 'Grade B salary is required.'),
    gradeC: z.coerce.number().min(1, 'Grade C salary is required.'),
    ironingSalesMen: z.coerce.number().min(1, 'Ironing salesmen salary is required.'),
    alteringSalesMen: z.coerce.number().min(1, 'Altering salesmen salary is required.'),
    bonus: z.coerce.number().min(1, 'Bonus is required.'),
  }),
  cleaningStaff: z.object({
    gradeA: z.coerce.number().min(1, 'Grade A salary is required.'),
    gradeB: z.coerce.number().min(1, 'Grade B salary is required.'),
    gradeC: z.coerce.number().min(1, 'Grade C salary is required.'),
    bonus: z.coerce.number().min(1, 'Bonus is required.'),
  }),
});

export type SalarySchema = z.infer<typeof salarySchema>;

export const defaultSalaryValues: SalarySchema = {
  salesPerson: {
    gradeA: 0,
    gradeB: 0,
    gradeC: 0,
    ironingSalesMen: 0,
    alteringSalesMen: 0,
    bonus: 0,
  },
  cleaningStaff: {
    gradeA: 0,
    gradeB: 0,
    gradeC: 0,
    bonus: 0,
  },
};
