/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { SubmitHandler, useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { piecePricesResponseSchema, PiecePricesResponseSchema } from '../formSchemas/piecesSchema';
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';

// Example API query hooks (you will replace these with actual hooks or logic from your app)
import { useGetAllPiecePricesQuery, useCreateEditPiecePricesMutation } from '../../redux/features/pieces/pieceApiSlice';

// Form Component for Editing Piece Prices
const EditPiecePrices = () => {
  const { control, reset, handleSubmit, getValues } = useFormContext<PiecePricesResponseSchema>();

  // Fetch existing piece prices data
  const { data: piecePricesData, isLoading } = useGetAllPiecePricesQuery();
  const [updatePiecePrices] = useCreateEditPiecePricesMutation();

  // On form submit
  const onSubmit: SubmitHandler<PiecePricesResponseSchema> = async (data) => {
    try {
      const response = await updatePiecePrices(data);
      if (response.error) {
        console.log(response.error);
      }
    } catch (e) {
      toast.error(`Action Failed. ${e.message}`);
    }
  };

  // Validate form data
  const handleValidation = () => {
    const formData = getValues();
    const result = piecePricesResponseSchema.safeParse(formData);
    console.log(result);
    if (!result.success) {
      toast.error('Validation failed');
    } else {
      toast.success('Validation successful');
    }
  };

  // Pre-fill the form with the fetched data
  useEffect(() => {
    if (piecePricesData) {
      reset(piecePricesData, { keepDefaultValues: false });
    }
  }, [piecePricesData, reset]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* Iterate over each category */}
        {piecePricesData.map((category, categoryIndex) => (
          <div key={categoryIndex} className="col-12 mb-3">
            <div className="card">
              <div className="card-header">
                <h5>{category.category} Piece Prices</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {/* Iterate over each item in the category */}
                  {category?.items?.map((item, itemIndex) => (
                    <div key={itemIndex} className="col-6 mb-3">
                      <h6>{item.itemType}</h6>
                      <RHFTextField<PiecePricesResponseSchema> label="Cutting Price" name={`[${categoryIndex}].items[${itemIndex}].cuttingPrice`} />
                      <RHFTextField<PiecePricesResponseSchema> label="Tailoring Price" name={`[${categoryIndex}].items[${itemIndex}].tailoringPrice`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-end gap-2 mt-3">
        <button className="primary-button" type="submit">
          Update Piece Prices
        </button>
        <button className="primary-button" type="button" onClick={handleValidation}>
          Validate
        </button>
      </div>
    </form>
  );
};

export default EditPiecePrices;
