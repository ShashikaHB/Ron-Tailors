/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { SubmitHandler, useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { defaultPiecePricesValues, piecePricesSchema, PiecePricesSchema } from '../formSchemas/piecesSchema';
import { useGetPiecePricesByTypeQuery, useUpdatePiecePricesMutation } from '../../redux/features/pieces/pieceApiSlice';
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';

const EditPiecePrices = () => {
  const { control, reset: resetPiece, handleSubmit, getValues } = useFormContext<PiecePricesSchema>();

  const { data: cuttingPrices, isLoading: cuttingLoading } = useGetPiecePricesByTypeQuery('Cutting');
  const { data: tailoringPrices, isLoading: tailoringLoading } = useGetPiecePricesByTypeQuery('Tailoring');
  const [updatePiecePrices] = useUpdatePiecePricesMutation();

  const handlevalidaton = () => {
    const formData = getValues();

    const result = piecePricesSchema.safeParse(formData);
    console.log(result);
  };

  useEffect(() => {
    if (cuttingPrices) {
      resetPiece({ ...cuttingPrices, type: 'Cutting' }, { keepDefaultValues: false });
    } else {
      resetPiece(defaultPiecePricesValues, { keepDefaultValues: false });
    }

    if (tailoringPrices) {
      resetPiece({ ...tailoringPrices, type: 'Tailoring' }, { keepDefaultValues: false });
    } else {
      resetPiece(defaultPiecePricesValues, { keepDefaultValues: false });
    }
  }, [cuttingPrices, tailoringPrices, resetPiece]);

  const onSubmit: SubmitHandler<PiecePricesSchema> = async (data) => {
    try {
      const response = await updatePiecePrices(data.type, data);
      if (response.error) {
        console.log(response.error);
      }
    } catch (e) {
      toast.error(`Action Failed. ${e.message}`);
    }
  };

  return (
    <div className="row">
      <div className="col-12 mb-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-6">
              <div className="card h-100">
                <div className="card-header">
                  <h5>Cutting Piece Prices</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-6 mb-3">
                      <RHFTextField<PiecePricesSchema> label="Shirt" name="Shirt" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<PiecePricesSchema> label="Trouser" name="Trouser" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<PiecePricesSchema> label="Coat" name="Coat" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<PiecePricesSchema> label="West Coat" name="WestCoat" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<PiecePricesSchema> label="Cravat" name="Cravat" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<PiecePricesSchema> label="Bow" name="Bow" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<PiecePricesSchema> label="Tie" name="Tie" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card h-100">
                <div className="card-header">
                  <h5>Tailoring Piece Prices</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-6 mb-3">
                      <RHFTextField<PiecePricesSchema> label="Shirt" name="Shirt" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<PiecePricesSchema> label="Trouser" name="Trouser" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<PiecePricesSchema> label="Coat" name="Coat" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<PiecePricesSchema> label="West Coat" name="WestCoat" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<PiecePricesSchema> label="Cravat" name="Cravat" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<PiecePricesSchema> label="Bow" name="Bow" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<PiecePricesSchema> label="Tie" name="Tie" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button className="primary-button" type="submit">
              Update Piece Prices
            </button>
            <button className="primary-button" type="button" onClick={handlevalidaton}>
              Validate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPiecePrices;
