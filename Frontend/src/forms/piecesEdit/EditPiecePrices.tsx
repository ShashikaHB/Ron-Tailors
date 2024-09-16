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
import { PiecePricesSchema } from '../formSchemas/piecesSchema';
import { useGetAllPiecePricesQuery, useUpdatePiecePricesMutation } from '../../redux/features/pieces/pieceApiSlice';

// import { useUpdatePiecePricesMutation } from '../../redux/features/piecePrices/piecePricesApiSlice';

// Static predefined list of categories and item types
const productCategoryItemMap = [
  {
    category: 'Full Suit',
    items: ['Coat', 'Shirt', 'Trouser', 'West Coat', 'Cravat', 'Bow', 'Tie', 'Hanky'],
  },
  {
    category: 'National Suit',
    items: ['National Coat', 'National Shirt', 'Sarong', 'Trouser', 'Hanky'],
  },
  {
    category: 'Rent Full Suit',
    items: ['Rent Coat', 'Shirt', 'Trouser', 'Rent West Coat', 'Cravat', 'Bow', 'Tie', 'Hanky'],
  },
  {
    category: 'General',
    items: [
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
    ],
  },
];

const EditPiecePrices = () => {
  const { control, reset, handleSubmit, setValue } = useFormContext<PiecePricesSchema>();
  const [updatePiecePrices] = useUpdatePiecePricesMutation();
  const { data: piecePrices, isLoading: piecePricesLoading } = useGetAllPiecePricesQuery();

  useEffect(() => {
    // Fetch current piece prices from the backend and populate the form
    reset(piecePrices);
  }, [piecePrices]);

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

  return (
    <div className="row">
      <div className="col-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            {productCategoryItemMap.map((category, categoryIndex) => (
              <div className="col-6 mb-3" key={categoryIndex}>
                <div className="edit-peice-prices-card card h-100">
                  <div className="card-header">
                    <h5>{category.category} Prices</h5>
                  </div>
                  <div className="card-body">
                    <div className='overflow-y-auto overflow-x-hidden h-100'>
                    {category.items.map((itemType, itemIndex) => (
                      <div key={itemIndex} className="row mx-0">
                        <div className="col-12 mb-1">
                          <div>
                            <h6>{itemType}</h6>
                          </div>
                          <div className="row gap-2 mx-0 g-0">
                            <div className="col mb-3">
                              <RHFTextField<PiecePricesSchema>
                                label="Cutting Price"
                                name={`categories.${categoryIndex}.items.${itemIndex}.cuttingPrice` as const} // Using 'as const'
                              />
                            </div>
                            <div className="col mb-3">
                              {/* Tailoring Price */}
                              <RHFTextField<PiecePricesSchema>
                                label="Tailoring Price"
                                name={`categories.${categoryIndex}.items.${itemIndex}.tailoringPrice` as const} // Using 'as const'
                              />
                            </div>
                            {/* Cutting Price */}
                          </div>
                        </div>
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPiecePrices;
