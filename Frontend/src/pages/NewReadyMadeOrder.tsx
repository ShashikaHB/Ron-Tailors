/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { defaultReadyMadeOrderValues, readyMadeItemSchema, ReadyMadeItemSchema } from '../forms/formSchemas/readyMadeItemSchema';
import AddReadyMadeOrderForm from '../forms/addReadyMadeOrder/AddReadyMadeOrderForm';

const NewReadyMadeOrder = () => {
  const methods = useForm<ReadyMadeItemSchema>({
    mode: 'all',
    resolver: zodResolver(readyMadeItemSchema),
    defaultValues: defaultReadyMadeOrderValues,
  });
  return (
    <FormProvider {...methods}>
      <div>
        <AddReadyMadeOrderForm />
        <DevTool control={methods.control} />
      </div>
    </FormProvider>
  );
};

export default NewReadyMadeOrder;
