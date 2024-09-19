/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect } from 'react';
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';
import { piecePricesSchema, PiecePricesSchema } from '../formSchemas/piecesSchema';
import { useGetAllPiecePricesQuery, useUpdatePiecePricesMutation } from '../../redux/features/pieces/pieceApiSlice';
import { useAppDispatch } from '../../redux/reduxHooks/reduxHooks';
import { setLoading } from '../../redux/features/common/commonSlice';

// Static predefined list of General items
const generalItems = [
  'Coat',
  'National Coat',
  'West Coat',
  'Shirt',
  'Trouser',
  'Designed Trouser',
  'Designed Shirt',
  'National Shirt',
  'Rent Coat',
  'Rent West Coat',
  'Sarong',
  'Tie',
  'Bow',
  'Cravat',
  'Hanky',
  'Chain',
];

const EditPiecePrices = () => {
  const { reset, handleSubmit, getValues } = useFormContext<PiecePricesSchema>();
  const [updatePiecePrices, { isLoading: updatingPiecePrices }] = useUpdatePiecePricesMutation();
  const { data: piecePrices, isLoading: piecePricesLoading } = useGetAllPiecePricesQuery();

  const dispatch = useAppDispatch();

  useEffect(() => {
    // Fetch current piece prices from the backend and populate the form
    reset(piecePrices);
  }, [piecePrices, reset]);

  useEffect(() => {
    dispatch(setLoading(updatingPiecePrices));
  }, [updatingPiecePrices]);
  useEffect(() => {
    dispatch(setLoading(piecePricesLoading));
  }, [piecePricesLoading]);

  const onSubmit: SubmitHandler<PiecePricesSchema> = async (data) => {
    try {
      const response = await updatePiecePrices(data).unwrap();
      if (response.success) {
        toast.success('Piece prices updated successfully.');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const validate = () => {
    const formData = getValues();
    const validationResult = piecePricesSchema.safeParse(formData);
    console.log(validationResult);
  };

  return (
    <div className="row">
      <div className="col-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex justify-content-start gap-2 mb-3">
            <button className="primary-button" type="submit">
              Update Piece Prices
            </button>
          </div>
          <div className="row">
            <div className="col-12 mb-3">
              <div className="edit-piece-prices-card card h-100">
                <div className="card-header">
                  <h5>Piece Prices</h5>
                </div>
                <div className="card-body">
                  <div className="overflow-y-auto overflow-x-hidden h-100">
                    <div className="row mx-0">
                      <div className="col-12 mb-1">
                        {generalItems.map((itemType, itemIndex) => (
                          <div className="row gap-2 mx-0 g-0" key={itemIndex}>
                            <div>
                              <div className="font-weight-bold">{itemType}</div>
                            </div>
                            {/* Cutting Price */}
                            <div className="col mb-3">
                              <RHFTextField<PiecePricesSchema>
                                label="Cutting Price"
                                name={`items.${itemIndex}.cuttingPrice` as const} // Binding to specific item index
                              />
                            </div>
                            {/* Tailoring Price */}
                            <div className="col mb-3">
                              <RHFTextField<PiecePricesSchema>
                                label="Tailoring Price"
                                name={`items.${itemIndex}.tailoringPrice` as const} // Binding to specific item index
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPiecePrices;
