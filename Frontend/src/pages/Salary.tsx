/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { FormProvider, useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { defaultSalaryValues, SalarySchema, salarySchema } from '../forms/formSchemas/salarySchema';
import EditSalary from '../forms/salaryEdit/EditSalary';
import EditPiecePrices from '../forms/piecesEdit/EditPieces';

const Salary = () => {
  const methods = useForm<SalarySchema>({
    mode: 'all',
    resolver: zodResolver(salarySchema),
    defaultValues: defaultSalaryValues,
  });
  const pieceMethods = useForm<SalarySchema>({
    mode: 'all',
    resolver: zodResolver(salarySchema),
    defaultValues: defaultSalaryValues,
  });
  return (
    <>
      <FormProvider {...methods}>
        <div>
          <EditSalary />
          <DevTool control={methods.control} />
        </div>
      </FormProvider>
      <FormProvider {...pieceMethods}>
        <div>
          <EditPiecePrices />
          <DevTool control={pieceMethods.control} />
        </div>
      </FormProvider>
    </>
  );
};

export default Salary;
