/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { RiCloseLargeLine } from '@remixicon/react';
import { toast } from 'sonner';
import { useEffect } from 'react';
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';
import { defaultTransactionValues } from '../formSchemas/transactionSchema';
import RHFDropDown from '../../components/customFormComponents/customDropDown/RHFDropDown';
import { TransactionCategorySchema } from '../formSchemas/transactionCategorySchema';
import transactionType from '../../consts/transactionTypes';
import { useAddCustomTransactionCategoryMutation } from '../../redux/features/transaction/transactionApiSlice';
import { useAppDispatch } from '../../redux/reduxHooks/reduxHooks';
import { setLoading } from '../../redux/features/common/commonSlice';

type AddMaterialFormProps = {
  handleClose: () => void;
  materialId?: number | null;
};

const AddTransactionCategory = ({ handleClose, materialId }: AddMaterialFormProps) => {
  const { control, unregister, watch, reset, setValue, handleSubmit, getValues } = useFormContext<TransactionCategorySchema>();

  const dispatch = useAppDispatch();

  const [addTransactionCategory, { isLoading }] = useAddCustomTransactionCategoryMutation();

  const handleFormClose = (): void => {
    handleClose();
    reset(defaultTransactionValues);
  };

  const handleClear = (): void => {
    reset(defaultTransactionValues);
  };

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading]);

  const onSubmit: SubmitHandler<TransactionCategorySchema> = async (data) => {
    try {
      const response = await addTransactionCategory(data).unwrap();
      if (response.success) {
        toast.success('Transaction Category Added.');
        reset();
        handleFormClose();
      }
    } catch (error) {
      toast.error(`Transaction Category Action Failed. ${error.message}`);
    }
  };

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title"> Add New Transaction Category</h5>
          <button type="button" aria-label="close-btn" className="icon-button" onClick={handleFormClose}>
            <RiCloseLargeLine size={18} />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="inputGroup">
              <RHFDropDown<TransactionCategorySchema> options={transactionType} name="transactionType" label="Transaction Type" />
              <RHFTextField<TransactionCategorySchema> label="Transaction Category" name="transactionCategory" />
            </div>
            <div className="modal-footer mt-3">
              <button className="secondary-button" onClick={handleClear} type="button">
                Clear
              </button>
              <button className="primary-button" type="submit" onClick={() => console.log('btn clicked')}>
                Add Transaction Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionCategory;
