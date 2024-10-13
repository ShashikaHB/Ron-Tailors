/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { SubmitHandler, useFormContext, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
import { RiCloseLargeLine } from '@remixicon/react';
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';
import { defaultRentItemValues, RentItemSchema } from '../formSchemas/rentItemSchema';
import RHFDropDown from '../../components/customFormComponents/customDropDown/RHFDropDown';
import ProductType from '../../enums/ProductType';
import { useAddNewRentItemMutation, useLazyGetSingleRentItemQuery, useUpdateSingleRentItemMutation } from '../../redux/features/rentItem/rentItemApiSlice';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks/reduxHooks';
import { selectedRentItemId } from '../../redux/features/orders/orderSlice';
import { setLoading } from '../../redux/features/common/commonSlice';

const productTypes = [
  {
    value: 0,
    label: 'Select a Product Type',
  },
  {
    value: ProductType.Coat,
    label: 'Coat',
  },
  {
    value: ProductType.Shirt,
    label: 'Shirt',
  },
  {
    value: ProductType.Bow,
    label: 'Bow',
  },
  {
    value: ProductType.WestCoat,
    label: 'WestCoat',
  },
  {
    value: ProductType.Cravat,
    label: 'Cravat',
  },
  {
    value: ProductType.Tie,
    label: 'Tie',
  },
  {
    value: ProductType.Trouser,
    label: 'Trouser',
  },
];

type AddMaterialFormProps = {
  handleClose: () => void;
  rentItemId?: number | null;
};

const AddEditRentItemForm = ({ handleClose, rentItemId }: AddMaterialFormProps) => {
  const { control, unregister, watch, reset, setValue, handleSubmit, getValues } = useFormContext<RentItemSchema>();

  const dispatch = useAppDispatch();

  const selectedRentItem = useAppSelector(selectedRentItemId);

  const [addNewRentItem, { isLoading: addingRentItem }] = useAddNewRentItemMutation();
  const [updateSingleRentItem, { isLoading: updatingRentItem }] = useUpdateSingleRentItemMutation();
  const [triggerGetSingleRentItem, { data: singleRentItem, error: Error, isLoading: loadingSingleItem }] = useLazyGetSingleRentItemQuery();

  const variant = useWatch({ control, name: 'variant' });

  const handleFormClose = (): void => {
    handleClose();
    setValue('size', null);
    reset(defaultRentItemValues);
  };

  const handleClear = (): void => {
    reset(defaultRentItemValues);
  };

  useEffect(() => {
    if (singleRentItem) {
      reset(singleRentItem);
    }
  }, [singleRentItem, reset]);

  useEffect(() => {
    if (selectedRentItem) triggerGetSingleRentItem(selectedRentItem);
  }, [selectedRentItem]);

  const onSubmit: SubmitHandler<RentItemSchema> = async (data) => {
    try {
      if (variant === 'edit') {
        const response = await updateSingleRentItem(data);
        if (response.error) {
          //   toast.error(`Rent Item Update Failed`);
        } else {
          //   toast.success('Rent Item Updated.');
          setValue('size', null);
          reset(defaultRentItemValues);
        }
      } else {
        const response = await addNewRentItem(data);
        if (response.error) {
          //   toast.error(`Rent Item Adding Failed`);
        } else {
          //   toast.success('New material Added.');
          setValue('size', null);
          reset(defaultRentItemValues);
        }
      }
    } catch (error) {
      //   toast.error(`Rent Item Action Failed. ${error.message}`);
    }
  };
  useEffect(() => {
    dispatch(setLoading(addingRentItem));
  }, [addingRentItem]);
  useEffect(() => {
    dispatch(setLoading(updatingRentItem));
  }, [updatingRentItem]);
  useEffect(() => {
    dispatch(setLoading(loadingSingleItem));
  }, [loadingSingleItem]);

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title"> Add New Rent Item</h5>
          <button aria-label="close-btn" className="icon-button" type="button" onClick={handleFormClose}>
            <RiCloseLargeLine size={18} />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="inputGroup">
              <RHFTextField<RentItemSchema> label="Color" name="color" />
              <RHFTextField<RentItemSchema> label="Size" name="size" type="number" />
              <RHFTextField<RentItemSchema> label="Description" name="description" />
              <RHFDropDown<RentItemSchema> options={productTypes} name="itemType" label="Product Type" />
            </div>
            <div className="modal-footer mt-3">
              {variant === 'create' && (
                <button className="secondary-button" onClick={handleClear} type="button">
                  Clear
                </button>
              )}
              <button className="primary-button" type="submit" onClick={() => console.log('btn clicked')}>
                {variant === 'create' ? 'Add ' : 'Edit '}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditRentItemForm;
