/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { FormProvider, useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { OrderSchema, defaultOrderValues, orderSchema } from '../forms/formSchemas/orderSchema';
import AddEditOrder from '../forms/orderAddEdit/AddEditOrder';

const NewSalesOrder = () => {
  const methods = useForm<OrderSchema>({
    mode: 'all',
    resolver: zodResolver(orderSchema),
    defaultValues: defaultOrderValues,
  });
  return (
    <FormProvider {...methods}>
      <div>
        <AddEditOrder />
        <DevTool control={methods.control} />
      </div>
    </FormProvider>
  );
};

export default NewSalesOrder;
