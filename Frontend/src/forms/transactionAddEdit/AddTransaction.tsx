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
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';
import { useAddNewMaterialMutation, useGetSingleMaterialQuery, useUpdateSingleMaterialMutation } from '../../redux/features/material/materialApiSlice';
import { defaultTransactionValues, TransactionSchema } from '../formSchemas/transactionSchema';
import paymentOptions from '../../consts/paymentOptions';
import RHFDropDown from '../../components/customFormComponents/customDropDown/RHFDropDown';
import RHFDatePicker from '../../components/customFormComponents/customDatePicker/RHFDatePricker';

type AddMaterialFormProps = {
  handleClose: () => void;
  materialId?: number | null;
};

const AddTransaction = ({ handleClose, materialId }: AddMaterialFormProps) => {
  const { control, unregister, watch, reset, setValue, handleSubmit, getValues } = useFormContext<TransactionSchema>();

  const [addNewMaterial] = useAddNewMaterialMutation();
  const [updateMaterial] = useUpdateSingleMaterialMutation();
  const { data: singleMaterial } = useGetSingleMaterialQuery(materialId as number);

  const variant = useWatch({ control });

  const handleFormClose = (): void => {
    handleClose();
    reset(defaultTransactionValues);
  };

  const handleClear = (): void => {
    reset(defaultTransactionValues);
  };

  useEffect(() => {
    const sub = watch((value) => {
      console.log(value);
    });

    return () => {
      sub.unsubscribe();
    };
  }, [watch]);

  const onSubmit: SubmitHandler<TransactionSchema> = async (data) => {
    try {
      if (variant === 'edit') {
        const response = await updateMaterial(data);
        if (response.error) {
          toast.error('Material Update Failed');
          console.log(response.error);
        } else {
          toast.success('Material Updated.');
          reset();
        }
      } else {
        const response = await addNewMaterial(data);
        if (response.error) {
          toast.error('Material Adding Failed');
          console.log(response.error);
        } else {
          toast.success('New material Added.');
          reset();
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
          <h5 className="modal-title"> Add New Transaction</h5>
          <button type="button" aria-label="close-btn" className="icon-button" onClick={handleFormClose}>
            <RiCloseLargeLine size={18} />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="inputGroup">
              <RHFDropDown<TransactionSchema> options={paymentOptions} name="transactionType" label="Payment Type" />
              <RHFDropDown<TransactionSchema> options={paymentOptions} name="transactionCategory" label="Payment Type" />
              <RHFTextField<TransactionSchema> label="Unit Price" name="description" type="Transaction Description" />
              <RHFDatePicker<TransactionSchema> name="date" label="Transaction Date" />
              <RHFDropDown<TransactionSchema> options={paymentOptions} name="paymentType" label="Payment Type" />
              <RHFTextField<TransactionSchema> label="Amount" name="amount" />
            </div>
            <div className="modal-footer mt-3">
              <button className="secondary-button" onClick={handleClear} type="button">
                Clear
              </button>

              <button className="primary-button" type="submit" onClick={() => console.log('btn clicked')}>
                Add Transaction
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
