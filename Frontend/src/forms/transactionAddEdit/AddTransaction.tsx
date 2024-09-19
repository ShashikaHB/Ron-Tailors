/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { SubmitHandler, useFormContext, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { RiCloseLargeLine } from '@remixicon/react';
import { useEffect, useState } from 'react';
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';
import { defaultTransactionValues, TransactionSchema } from '../formSchemas/transactionSchema';
import paymentOptions from '../../consts/paymentOptions';
import RHFDropDown from '../../components/customFormComponents/customDropDown/RHFDropDown';
import RHFDatePicker from '../../components/customFormComponents/customDatePicker/RHFDatePricker';
import { useAddCustomTransactionMutation, useGetAllTransactionCategoriesQuery } from '../../redux/features/transaction/transactionApiSlice';
import transactionType from '../../consts/transactionTypes';
import { Roles } from '../../enums/Roles';
import { allUsers } from '../../redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks/reduxHooks';
import getUserRoleBasedOptions from '../../utils/userUtils';
import stores from '../../consts/stores';
import { setLoading } from '../../redux/features/common/commonSlice';

type AddMaterialFormProps = {
  handleClose: () => void;
  materialId?: number | null;
};

const AddTransaction = ({ handleClose, materialId }: AddMaterialFormProps) => {
  const { control, unregister, watch, reset, setValue, handleSubmit, getValues } = useFormContext<TransactionSchema>();

  const dispatch = useAppDispatch();

  // Fetch transactions with the selected date range
  const { data: transactionCategories, isLoading: categoryLoading } = useGetAllTransactionCategoriesQuery({});
  const [addTransaction, { isLoading: addTransactionLoading }] = useAddCustomTransactionMutation();
  const [categories, setCategories] = useState([]);
  const selectedTransactionType = useWatch({ control, name: 'transactionType' });

  const users = useAppSelector(allUsers);

  const salesPeople = getUserRoleBasedOptions(users, Roles.SalesPerson);

  const handleFormClose = (): void => {
    handleClose();
    reset(defaultTransactionValues);
  };

  const handleClear = (): void => {
    reset(defaultTransactionValues);
  };

  useEffect(() => {
    dispatch(setLoading(categoryLoading));
  }, [categoryLoading]);
  useEffect(() => {
    dispatch(setLoading(addTransactionLoading));
  }, [addTransactionLoading]);

  useEffect(() => {
    if (transactionCategories) {
      const filteredCategories = transactionCategories
        .filter((category: any) => category.transactionType === selectedTransactionType)
        .map((category: any) => ({
          value: category.transactionCategory,
          label: category.transactionCategory,
        }));

      setCategories(filteredCategories);
    }
  }, [transactionCategories, selectedTransactionType]);

  const onSubmit: SubmitHandler<TransactionSchema> = async (data) => {
    try {
      const response = await addTransaction(data);
      if (response?.data?.success) {
        toast.success('Transaction Recorded!');
        reset(defaultTransactionValues);
        // handleClose();
      }
    } catch (error) {
      toast.error(`Transaction addition Failed. ${error.message}`);
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
              <RHFDropDown<TransactionSchema> options={transactionType} name="transactionType" label="Transaction Type" />
              <RHFDropDown<TransactionSchema> options={categories} name="transactionCategory" label="Transaction Category" />
              <RHFDropDown<TransactionSchema> options={stores} name="store" label="Store" />
              <RHFTextField<TransactionSchema> label="Description" name="description" type="Transaction Description" />
              <RHFDatePicker<TransactionSchema> name="date" label="Transaction Date" />
              <RHFDropDown<TransactionSchema> options={paymentOptions} name="paymentType" label="Payment Type" />
              <RHFTextField<TransactionSchema> label="Amount" name="amount" type="number" />
              <RHFDropDown<TransactionSchema> options={salesPeople} name="salesPerson" label="Sales Person" />
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
