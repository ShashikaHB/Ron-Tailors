/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { FormProvider, useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import EditPiecePrices from '../forms/piecesEdit/EditPiecePrices';
import { defaultPiecePrices, piecePricesSchema, PiecePricesSchema } from '../forms/formSchemas/piecesSchema';

const PiecePrices = () => {
  const pieceMethods = useForm<PiecePricesSchema>({
    mode: 'all',
    resolver: zodResolver(piecePricesSchema),
    defaultValues: defaultPiecePrices,
  });
  return (
    <FormProvider {...pieceMethods}>
      <div>
        <EditPiecePrices />
        <DevTool control={pieceMethods.control} />
      </div>
    </FormProvider>
  );
};

export default PiecePrices;
