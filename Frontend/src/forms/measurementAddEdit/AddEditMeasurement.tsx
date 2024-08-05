/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { useEffect } from 'react';
import { SubmitHandler, useFormContext, useWatch } from 'react-hook-form';
import { TextField } from '@mui/material';
import { RiCloseLargeLine, RiClipboardLine } from '@remixicon/react';
import { toast } from 'sonner';
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';
import { MeasurementSchema } from '../formSchemas/measurementSchema';
import RHFSwitch from '../../components/customFormComponents/customSwitch/RHFSwitch';
import RHFDatePicker from '../../components/customFormComponents/customDatePicker/RHFDatePricker';
import { useAppSelector } from '../../redux/reduxHooks/reduxHooks';
import { selectSelectedProduct } from '../../redux/features/product/productSlice';
import { useGetSingleProductQuery, useUpdateSingleProductMutation } from '../../redux/features/product/productApiSlice';
import Loader from '../../components/loderComponent/Loader';
import { useCreateMeasurementMutation } from '../../redux/features/measurement/measurementApiSlice';

type AddEditProductProps = {
  handleClose: () => void;
};

const AddEditMeasurement = ({ handleClose }: AddEditProductProps) => {
  const {
    control, unregister, watch, reset, setValue, handleSubmit, getValues, clearErrors,
  } = useFormContext<MeasurementSchema>();

  useEffect(() => {
    const sub = watch((value) => {
      console.log(value);
    });

    return () => {
      sub.unsubscribe();
    };
  }, [watch]);

  const selectedProductId = useAppSelector(selectSelectedProduct);

  const measurements = useWatch({ control, name: 'measurements' }) as string[];
  const variant = useWatch({ control, name: 'variant' });

  const [addMeasurement, { data: newMeasurement }] = useCreateMeasurementMutation();

  const [updateProduct, { data: updatedProduct }] = useUpdateSingleProductMutation();

  const { data: productData, error, isLoading } = useGetSingleProductQuery(selectedProductId);

  const addText = (text: string) => {
    const currentStyle = getValues('style');
    const newStyle = currentStyle ? `${currentStyle}/ ${text}` : text;
    setValue('style', newStyle);
  };

  const addMeasurements = (index: number, measurement: string) => {
    const currentMeasurements = getValues('measurements');
    const updatedMeasurements = [...currentMeasurements];
    updatedMeasurements[index] = measurement;
    setValue('measurements', updatedMeasurements);
  };

  const handleClear = () => {
    reset();
  };

  const onSubmit: SubmitHandler<MeasurementSchema> = async (data) => {
    try {
      if (variant === 'edit') {
        // const response = await updateMaterial(data);
        // if (response.error) {
        //   toast.error(`Material Update Failed`);
        //   console.log(response.error);
        // } else {
        //   toast.success("Material Updated.");
        //   reset();
        // }
      } else {
        const response = await addMeasurement(data);
        if (response.error) {
          toast.error('Material Adding Failed');
          console.log(response.error);
        } else {
          toast.success('New material Added.');
          const newResponse = await updateProduct({
            productId: selectedProductId,
            measurement: response.data.measurementId,
          });
          if (newResponse.error) {
            toast.error('Product update failed.');
          } else {
            toast.success('Product update successful');
          }
          reset();
          handleClose();
        }
      }
    } catch (error) {
      toast.error(`Material Action Failed. ${error.message}`);
    }
  };

  useEffect(() => {
    if (productData) {
      toast.success('Product data fetched.');
      setValue('itemType', productData.type);
    } else if (error) {
      toast.error('Error fetching productData');
    }
  }, [productData, error]);

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">
            Add Measurements to
            {productData?.type}
          </h5>
          <button className="icon-button" type="button" onClick={handleClose}>
            <RiCloseLargeLine size={18} />
          </button>
        </div>
        <div className="modal-body d-flex h-100 flex-column">
          <div>
            <div className="d-flex align-items-center mb-3 gap-2">
              <RiClipboardLine size={18} />
              <div>Copy form other Measurement</div>
            </div>
          </div>
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <Loader />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="inputGroup">
                <div className="d-flex gap-1">
                  <button className="primary-button" type="button" onClick={() => addText('SB')}>
                    SB
                  </button>
                  <button className="primary-button" type="button" onClick={() => addText('DB')}>
                    DB
                  </button>
                  <button className="primary-button" type="button" onClick={() => addText('Hinec')}>
                    Hinec
                  </button>
                </div>
                <div className="d-flex gap-1">
                  <button className="primary-button" type="button" onClick={() => addText('1 BT')}>
                    1 BT
                  </button>
                  <button className="primary-button" type="button" onClick={() => addText('2 BT')}>
                    2 BT
                  </button>
                  <button className="primary-button" type="button" onClick={() => addText('3 BT')}>
                    3 BT
                  </button>
                </div>
                <div className="d-flex gap-1">
                  <button className="primary-button" type="button" onClick={() => addText('Normal')}>
                    Normal
                  </button>
                  <button className="primary-button" type="button" onClick={() => addText('Half Satting')}>
                    Half Satting
                  </button>
                  <button className="primary-button" type="button" onClick={() => addText('Full Satting')}>
                    Full Satting
                  </button>
                </div>
              </div>
              <div className="inputGroup my-3 w-30 d-flex flex-direction-row">
                <RHFTextField<MeasurementSchema> label="Style" name="style" />
              </div>
              <h6>Add Measurements</h6>
              <div className="my-3">
                <div className="d-flex gap-1 mb-1">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <TextField key={index} value={measurements[index]} onChange={(e) => addMeasurements(index, e.target.value)} />
                  ))}
                </div>
                <div className="d-flex gap-1 mb-1">
                  {[5, 6, 7, 8, 9].map((index) => (
                    <TextField key={index} value={measurements[index]} onChange={(e) => addMeasurements(index, e.target.value)} />
                  ))}
                </div>
              </div>
              <div className="inputGroup">
                <RHFTextField<MeasurementSchema> label="Remarks" name="remarks" />
                <RHFSwitch<MeasurementSchema> name="isNecessary" label="Necessary on the release date" />
                <RHFDatePicker<MeasurementSchema> name="estimatedReleaseDate" label="Estimated release date" />
              </div>
              <div className="modal-footer mt-3">
                <button className="secondary-button" type="button" onClick={() => handleClear()}>
                  Clear
                </button>

                <button className="primary-button" type="submit">
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEditMeasurement;
