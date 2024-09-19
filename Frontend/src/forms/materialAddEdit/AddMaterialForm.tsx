/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { SubmitHandler, useFormContext, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { RiCloseLargeLine } from '@remixicon/react';
import { useEffect } from 'react';
import { MaterialSchema, defaultMaterialValues, materialSchema } from '../formSchemas/materialsSchema';
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';
import { useAddNewMaterialMutation, useGetSingleMaterialQuery, useUpdateSingleMaterialMutation } from '../../redux/features/material/materialApiSlice';
import RHFDropDown from '../../components/customFormComponents/customDropDown/RHFDropDown';
import stores from '../../consts/stores';
import { useAppDispatch } from '../../redux/reduxHooks/reduxHooks';
import { setLoading } from '../../redux/features/common/commonSlice';

type AddMaterialFormProps = {
  handleClose: () => void;
  materialId?: number | null;
};

const AddMaterialForm = ({ handleClose, materialId }: AddMaterialFormProps) => {
  const { control, unregister, watch, reset, setValue, handleSubmit, getValues } = useFormContext<MaterialSchema>();

  const [addNewMaterial, { isLoading: addingMaterial }] = useAddNewMaterialMutation();
  const [updateMaterial, { isLoading: updatingMaterial }] = useUpdateSingleMaterialMutation();
  const { data: singleMaterial, isLoading: materialLoading } = useGetSingleMaterialQuery(materialId as number);

  const variant = useWatch({ control, name: 'variant' });

  const dispatch = useAppDispatch();

  const handleFormClose = (): void => {
    handleClose();
    reset(defaultMaterialValues);
  };

  useEffect(() => {
    dispatch(setLoading(addingMaterial));
  }, [addingMaterial]);

  //   useEffect(() => {
  //     dispatch(setLoading(updatingMaterial));
  //   }, [updatingMaterial]);

  useEffect(() => {
    dispatch(setLoading(materialLoading));
  }, [materialLoading]);

  const validate = () => {
    const formData = getValues();
    const validationResult = materialSchema.safeParse(formData);
    console.log(validationResult);
  };

  const handleClear = (): void => {
    reset(defaultMaterialValues);
  };

  useEffect(() => {
    if (singleMaterial) {
      reset(singleMaterial);
    }
  }, [singleMaterial, reset]);

  useEffect(() => {
    const sub = watch((value) => {
      console.log(value);
    });

    return () => {
      sub.unsubscribe();
    };
  }, [watch]);

  const onSubmit: SubmitHandler<MaterialSchema> = async (data) => {
    try {
      if (variant === 'edit') {
        const response = await updateMaterial(data);
        if (response.error) {
          console.log(response.error);
        } else {
          toast.success('Material Updated.');
          reset();
          handleFormClose();
        }
      } else {
        const response = await addNewMaterial(data);
        if (response.error) {
          console.log(response.error);
        } else {
          toast.success('New material Added.');
          reset();
          handleFormClose();
        }
      }
    } catch (error) {
      toast.error(`Material Action Failed. ${error.message}`);
    }
  };

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title"> Add New Material</h5>
          <button type="button" aria-label="close-btn" className="icon-button" onClick={handleFormClose}>
            <RiCloseLargeLine size={18} />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="inputGroup">
              <RHFTextField<MaterialSchema> label="Name" name="name" />
              <RHFTextField<MaterialSchema> label="Color" name="color" />
              <RHFDropDown<MaterialSchema> options={stores} name="store" label="Store" />
              <RHFTextField<MaterialSchema> label="Unit Price" name="unitPrice" type="number" />
              <RHFTextField<MaterialSchema> label="Available Units" name="noOfUnits" type="number" />
              <RHFTextField<MaterialSchema> label="Brand" name="brand" />
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

export default AddMaterialForm;
