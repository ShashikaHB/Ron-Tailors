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
import { defaultMeasurementValues, measurementSchema, MeasurementSchema } from '../formSchemas/measurementSchema';
import RHFSwitch from '../../components/customFormComponents/customSwitch/RHFSwitch';
import RHFDatePicker from '../../components/customFormComponents/customDatePicker/RHFDatePricker';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks/reduxHooks';
import { selectSelectedProduct } from '../../redux/features/product/productSlice';
import { useLazyGetSingleProductQuery, useUpdateSingleProductMutation } from '../../redux/features/product/productApiSlice';
import {
  useCreateMeasurementMutation,
  useLazyGetPreviousMeasurementsQuery,
  useUpdateMeasurementMutation,
} from '../../redux/features/measurement/measurementApiSlice';
import { selectProductId, setLoading } from '../../redux/features/common/commonSlice';
import { selectCustomerId } from '../../redux/features/orders/orderSlice';

type AddEditProductProps = {
  handleClose: () => void;
  onMeasurementSuccess: (productId: number) => void;
};

const AddEditMeasurement = ({ handleClose, onMeasurementSuccess }: AddEditProductProps) => {
  const { control, unregister, watch, reset, setValue, handleSubmit, getValues, clearErrors } = useFormContext<MeasurementSchema>();

  const measurements = useWatch({ control, name: 'measurements' }) as string[];
  const variant = useWatch({ control, name: 'variant' });
  const customerId = useWatch({ control, name: 'customer' });

  const selectedProductId = useAppSelector(selectSelectedProduct);
  const selectedCustomer = useAppSelector(selectCustomerId);

  const [triggerGetProduct, { data: productData, isLoading: productDataLoading }] = useLazyGetSingleProductQuery();
  const [getPrvMeasurements, { data: prevMeasurements, isLoading: prevMeasurementLoading }] = useLazyGetPreviousMeasurementsQuery();

  const dispatch = useAppDispatch();

  const productId = useAppSelector(selectProductId);

  const [addMeasurement, { data: newMeasurement, isLoading: addMeasurementLoading }] = useCreateMeasurementMutation();

  const [updateProduct, { data: updatedProduct, isLoading: updateProductLoading }] = useUpdateSingleProductMutation();

  const [updateMeasurement, { data: updatedMeasurement, isLoading: updateMeasurementLoading }] = useUpdateMeasurementMutation();

  //   const { data: productData, isLoading } = useGetSingleProductQuery(selectedProductId);

  //   useEffect(() => {
  //     if (productData) {
  //       getPrvMeasurements({ customerId: selectedCustomer, productType: productData?.itemType });
  //     }
  //   }, [productData]);

  useEffect(() => {
    triggerGetProduct(productId);
  }, [productId]);

  useEffect(() => {
    dispatch(setLoading(productDataLoading));
  }, [productDataLoading]);
  useEffect(() => {
    dispatch(setLoading(prevMeasurementLoading));
  }, [prevMeasurementLoading]);

  useEffect(() => {
    dispatch(setLoading(addMeasurementLoading));
  }, [addMeasurementLoading]);
  //   useEffect(() => {
  //     dispatch(setLoading(updateProductLoading));
  //   }, [updateProductLoading]);
  useEffect(() => {
    dispatch(setLoading(updateMeasurementLoading));
  }, [updateMeasurementLoading]);

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

  const handleMeasurementClose = () => {
    handleClose();
    handleClear();
  };

  const handleClear = () => {
    reset(defaultMeasurementValues);
  };

  const handleValidateData = () => {
    const formData = getValues();

    const result = measurementSchema.safeParse(formData);

    console.log(result);
  };

  const handleAddPrevMeasurement = (prevMeasurement: any) => {
    reset({
      ...prevMeasurement,
      estimatedReleaseDate: new Date(prevMeasurement.estimatedReleaseDate), // Convert date
      customer: prevMeasurement?.customer?.customerId,
      variant: 'create', // Set variant to 'edit'
    });
  };

  const onSubmit: SubmitHandler<MeasurementSchema> = async (data) => {
    try {
      if (variant === 'edit') {
        const response = await updateMeasurement(data);
        if (response) {
          toast.success('Measurement Updated.');
        }
      } else {
        const response = await addMeasurement({ ...data, customer: customerId });
        if (response.error) {
          console.log(response.error);
        } else {
          const newResponse = await updateProduct({
            productId: selectedProductId,
            measurement: response.data.measurementId,
          });
          if (newResponse.error) {
            console.log(newResponse.error);
          } else {
            onMeasurementSuccess(selectedProductId);
            toast.success('New measurement Added.');
          }
          reset();
          handleMeasurementClose();
        }
      }
    } catch (e) {
      toast.error(`Measurement Action Failed. ${e.message}`);
    }
  };

  const validate = () => {
    const formData = getValues();
    const validationResult = measurementSchema.safeParse(formData);
  };

  useEffect(() => {
    if (productData) {
      setValue('itemType', productData.itemType);
      if (productData) {
        const prevMeasures = getPrvMeasurements({ customerId: selectedCustomer, productType: productData?.itemType }).unwrap();
      }
    }
    if (productData?.measurement) {
      reset({
        ...productData.measurement,
        estimatedReleaseDate: new Date(productData.measurement.estimatedReleaseDate), // Convert date
        customer: productData?.measurement?.customer?.customerId,
        variant: 'edit', // Set variant to 'edit'
      });
    }
    if (updatedMeasurement) {
      reset(updatedMeasurement);
    }

    if (!customerId || customerId === 0) {
      setValue('customer', selectedCustomer);
    }
  }, [productData, reset, updatedMeasurement, selectedCustomer]);

  return (
    <div className="modal-dialog modal-dialog-centered add-edit-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">
            Add Measurements to
            {` ${productData?.itemType}`}
          </h5>
          <button aria-label="close-btn" className="icon-button" type="button" onClick={handleMeasurementClose}>
            <RiCloseLargeLine size={18} />
          </button>
        </div>
        <div className="d-flex flex-column modal-body flex-grow-1 overflow-hidden">
          <div>
            <div className="d-flex align-items-center mb-3 gap-2">
              <RiClipboardLine size={18} />
              <div>Copy form other Measurement</div>
            </div>
            <div className="d-flex gap-3">
              {prevMeasurements?.length > 0 &&
                prevMeasurements.map((item) => (
                  <button key={item} className="primary-button" type="button" onClick={() => handleAddPrevMeasurement(item)}>
                    {`${item.measurementId}-${item.itemType}`}
                  </button>
                ))}
            </div>
          </div>

          <form className="d-flex flex-column flex-grow-1 overflow-hidden" onSubmit={handleSubmit(onSubmit)}>
            <div className="h-100 overflow-y-auto">
              <div className="inputGroup">
                <div>
                  <br />
                  <div style={{ border: '1px solid black', marginTop: '20px' }} />
                </div>
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
              <div className="mb-3">
                <RHFTextField<MeasurementSchema> label="Remarks" name="remarks" />
              </div>
              <div className="row g-0">
                <div className="col-6">
                  <RHFSwitch<MeasurementSchema> name="isNecessary" label="Necessary on the release date" />
                </div>
                <div className="col-6">
                  <RHFDatePicker<MeasurementSchema> name="estimatedReleaseDate" label="Estimated release date" />
                </div>
              </div>
            </div>
            <div className="modal-footer mt-3">
              <button className="secondary-button" type="button" onClick={() => handleClear()}>
                Clear
              </button>
              {/* <button className="secondary-button" type="button" onClick={() => handleValidateData()}>
                validate
              </button> */}
              <button className="primary-button" type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditMeasurement;
