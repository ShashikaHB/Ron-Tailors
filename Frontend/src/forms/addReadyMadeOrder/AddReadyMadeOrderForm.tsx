/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { SubmitHandler, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';
import { Roles } from '../../enums/Roles';
import { allUsers } from '../../redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks/reduxHooks';
import getUserRoleBasedOptions from '../../utils/userUtils';
import { ReadyMadeItemSchema } from '../formSchemas/readyMadeItemSchema';
import paymentOptions from '../../consts/paymentOptions';
import RHFDropDown from '../../components/customFormComponents/customDropDown/RHFDropDown';
import { readyMadeItems } from '../../consts/products';
import { useAddReadyMadeItemOrderMutation, useLazySearchCustomerQuery } from '../../redux/features/orders/orderApiSlice';
import stores from '../../consts/stores';
import { setLoading } from '../../redux/features/common/commonSlice';

const AddReadyMadeOrderForm = () => {
  const { control, unregister, watch, reset, setValue, handleSubmit, getValues, clearErrors } = useFormContext<ReadyMadeItemSchema>();

  const dispatch = useAppDispatch();
  const [triggerCustomerSearch, { data: customer, isLoading: customerLoading }] = useLazySearchCustomerQuery();

  const [addReadyMadeItem, { data, isLoading }] = useAddReadyMadeItemOrderMutation();
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  const users = useAppSelector(allUsers);
  const salesPeople = getUserRoleBasedOptions(users, Roles.SalesPerson);

  const handleSearchCustomer = () => {
    triggerCustomerSearch(customerSearchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the form submission
      handleSearchCustomer();
    }
  };

  useEffect(() => {
    dispatch(setLoading(customerLoading));
  }, [customerLoading]);

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading]);

  useEffect(() => {
    if (customer) {
      setValue('customer.name', customer.name);
      setValue('customer.mobile', customer.mobile);
      setCustomerSearchQuery('');
      clearErrors();
    }
  }, [customer, setValue, clearErrors]);

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading]);

  const onSubmit: SubmitHandler<ReadyMadeItemSchema> = async (data) => {
    try {
      const newWindow = window.open('', '_blank');

      const response = await addReadyMadeItem(data);
      if (response.data.success) {
        toast.success('Ready Made Order Created!');
        const orderId = response.data.data.readyMadeOrderId;
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const invoiceUrl = `${baseUrl}/api/v1/invoice/readyMadeOrder/${orderId}`;
        // Then set the location of the newly opened window
        if (newWindow) {
          newWindow.location.href = invoiceUrl;
        }
        reset();
      }
    } catch (e) {
      toast.error(`Ready made order Failed. ${e.message}`);
    }
  };

  return (
    <div className="row">
      <div className="col-12 mb-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-6">
              <div className="card h-100">
                <div className="card-header">
                  <h5>Ready Made Order</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-6 d-flex gap-2 mb-3 align-items-end">
                      <TextField
                        label="Search Customer"
                        placeholder="Search the customer by mobile or name"
                        value={customerSearchQuery}
                        onChange={(e) => setCustomerSearchQuery(e.target.value)}
                        onKeyDown={handleKeyPress}
                      />
                      <button className="icon-button" type="button" aria-label="search_customer" onClick={() => handleSearchCustomer()}>
                        <span>
                          <FaSearch />
                        </span>
                      </button>
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<ReadyMadeItemSchema> label="Name" name="customer.name" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<ReadyMadeItemSchema> label="Mobile" name="customer.mobile" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDropDown<ReadyMadeItemSchema> options={readyMadeItems} name="itemType" label="Product Type" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDropDown<ReadyMadeItemSchema> options={paymentOptions} name="paymentType" label="Payment Type" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<ReadyMadeItemSchema> label="Price" name="price" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDropDown<ReadyMadeItemSchema> options={salesPeople} name="salesPerson" label="Sales Person" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDropDown<ReadyMadeItemSchema> options={stores} name="store" label="Store" />
                    </div>
                  </div>
                  <div className="d-flex gap-2 justify-content-end">
                    <button className="secondary-button" onClick={() => reset()} type="button">
                      Clear
                    </button>
                    <button className="primary-button" type="submit" onClick={() => console.log('btn clicked')}>
                      Save
                    </button>
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

export default AddReadyMadeOrderForm;
