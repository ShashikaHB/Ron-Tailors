/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { FormProvider, useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import NewRentOut from '../forms/newRentAddEdit/AddEditRentOrder';
import {
  defaultRentOrderValues,
  rentOrderSchema,
  RentOrderSchema,
} from '../forms/formSchemas/rentOutSchema';

const NewRentOutOrder = () => {
  const methods = useForm<RentOrderSchema>({
    mode: 'all',
    resolver: zodResolver(rentOrderSchema),
    defaultValues: defaultRentOrderValues,
  });
  return (
    <FormProvider {...methods}>
      <div>
        <NewRentOut />
        <DevTool control={methods.control} />
      </div>
    </FormProvider>
  );
};

export default NewRentOutOrder;
