/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { TextField } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import { SubmitHandler, useFormContext, useWatch } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ColDef } from 'ag-grid-community';
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';
import RHFDropDown from '../../components/customFormComponents/customDropDown/RHFDropDown';
import RHFDatePicker from '../../components/customFormComponents/customDatePicker/RHFDatePricker';
import PaymentType from '../../enums/PaymentType';
import { defaultRentOrderValues, RentOrderSchema } from '../formSchemas/rentOrderSchema';
import { useLazySearchCustomerQuery } from '../../redux/features/orders/orderApiSlice';
import { ApiResponseError } from '../../types/common';
import { useLazySearchRentItemQuery } from '../../redux/features/product/productApiSlice';
import { RentItemDetails } from '../../types/rentItem';
import { RentItemDetailTypes } from '../../enums/RentItemDetails';
import MemoizedTable from '../../components/agGridTable/Table';
import RentItemDetailsRenderer from '../../components/agGridTable/customComponents/RentItemDetailsRenderer';
import ProductType from '../../enums/ProductType';
import { useAddNewRentOrderMutation } from '../../redux/features/rentOrder/rentOrderApiSlice';

const salesPeople = [
  {
    value: 0,
    label: 'Select a Sales Person',
  },
  {
    value: 112,
    label: 'shashika',
  },
  {
    value: 114,
    label: 'Nimal',
  },
];

const initialRentItemDetails: RentItemDetails = {
  rentItemId: null,
  color: '',
  size: undefined,
  description: '',
  handLength: '',
  notes: '',
  amount: 0,
  type: ProductType.Coat,
};

const paymentOptions = [
  {
    value: PaymentType.Cash,
    label: 'Cash',
  },
  {
    value: PaymentType.Card,
    label: 'Card',
  },
];

const NewRentOut = () => {
  const { control, unregister, watch, reset, setValue, handleSubmit, getValues, clearErrors } = useFormContext<RentOrderSchema>();

  const [triggerCustomerSearch, { data: customer, error: customerSearchError, isLoading }] = useLazySearchCustomerQuery();

  const [triggerProductSearch, { data: rentItem, error: rentItemSearchError, isLoading: rentItemLoading }] = useLazySearchRentItemQuery();

  const [addRentOrder] = useAddNewRentOrderMutation();

  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  const [productSearchQuery, setProductSearchQuery] = useState('');

  const [rentItemDetails, setRentItemDetails] = useState<RentItemDetails>(initialRentItemDetails);

  const [rowData, setRowData] = useState<RentItemDetails[]>([]);

  const total = useWatch({ control, name: 'totalPrice' });
  const advance = useWatch({ control, name: 'advPayment' });
  const discount = useWatch({ control, name: 'discount' });
  const variant = useWatch({ control, name: 'variant' });

  const colDefs = [
    { headerName: 'Barcode', field: 'rentItemId' },
    {
      headerName: 'Order Description',
      field: 'description',
      cellRenderer: RentItemDetailsRenderer,
      cellRendererParams: (params: any) => ({
        data: params.data,
      }),
      autoHeight: true,
    },
    { headerName: 'Amount', field: 'amount' },
    { headerName: '', field: 'action' },
  ];

  const defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
  };

  const handleSearchCustomer = () => {
    triggerCustomerSearch(customerSearchQuery);
  };
  const handleSearchProduct = () => {
    triggerProductSearch(productSearchQuery);
  };

  const handleRentItemAdd = () => {
    setRowData((prev) => [...prev, rentItemDetails]);
    setRentItemDetails(initialRentItemDetails);
    setProductSearchQuery('');
  };

  const handleResetRentOrder = () => {
    setRentItemDetails(initialRentItemDetails);
    setRowData([]);
    reset(defaultRentOrderValues);
    setCustomerSearchQuery('');
  };

  const handleRentItemDetailsChange = (key: string, value: string | number) => {
    switch (key) {
      case RentItemDetailTypes.handLength:
        setRentItemDetails((prevDetails) => ({ ...prevDetails, handLength: value as string }));
        break;
      case RentItemDetailTypes.notes:
        setRentItemDetails((prevDetails) => ({ ...prevDetails, notes: value as string }));
        break;
      case RentItemDetailTypes.amount:
        setRentItemDetails((prevDetails) => ({ ...prevDetails, amount: value as number }));
        break;
      default:
        toast.error(`No key found for ${key} in Rent item details`);
        break;
    }
  };
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.target instanceof HTMLInputElement) {
      const value = event.target.valueAsNumber;
      handleRentItemDetailsChange(RentItemDetailTypes.amount, value);
    }
  };

  useEffect(() => {
    const sub = watch((value) => {
      console.log(value);
    });

    return () => {
      sub.unsubscribe();
    };
  }, [watch]);

  useEffect(() => {
    if (rowData) {
      const totalAmount = rowData.reduce((sum, row) => sum + (row.amount || 0), 0);
      setValue('rentOrderDetails', rowData);
      setValue('totalPrice', totalAmount);
    }
  }, [rowData]);

  useEffect(() => {
    const validDiscount = discount ?? 0;
    const validAdvance = advance ?? 0;
    const subTotal = total - validDiscount;
    const balance = subTotal - validAdvance;
    setValue('subTotal', subTotal);
    setValue('balance', balance);
  }, [total, discount, advance]);

  useEffect(() => {
    if (customerSearchError) {
      let errorMessage = 'An unknown error occurred';
      if ('status' in customerSearchError) {
        // error is FetchBaseQueryError
        const err = customerSearchError as ApiResponseError;
        errorMessage = err.data.error ?? 'Something went wrong';
      } else if (customerSearchError instanceof Error) {
        // error is SerializedError
        errorMessage = customerSearchError.message;
      }
      toast.error(errorMessage);
    }
    if (customer) {
      setValue('customer.name', customer.name);
      setValue('customer.mobile', customer.mobile);
      setCustomerSearchQuery('');
      clearErrors();
    }
  }, [customerSearchError, customer, setValue, clearErrors]);

  useEffect(() => {
    if (rentItemSearchError) {
      let errorMessage = 'An unknown error occurred';
      if ('status' in rentItemSearchError) {
        // error is FetchBaseQueryError
        const err = rentItemSearchError as ApiResponseError;
        errorMessage = err.data.error ?? 'Something went wrong';
      } else if (rentItemSearchError instanceof Error) {
        // error is SerializedError
        errorMessage = rentItemSearchError.message;
      }
      toast.error(errorMessage);
    }
    if (rentItem) {
      toast.success('Rent Item fetched successfully.');
      setRentItemDetails((prevDetails) => ({
        ...prevDetails,
        description: rentItem.description,
        color: rentItem.color,
        size: rentItem.size,
        type: rentItem.type,
        rentItemId: rentItem.rentItemId,
      }));
      clearErrors();
    }
  }, [rentItemSearchError, rentItem]);

  const onSubmit: SubmitHandler<RentOrderSchema> = async (data) => {
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
        console.log(data);
        const response = await addRentOrder(data);
        if (response.error) {
          toast.error(`Order Adding Failed`);
          console.log(response.error);
        } else {
          const newOrderId = response.data.orderId;
          toast.success('New order Added.');
          handleResetRentOrder();
        }
      }
    } catch (error) {
      toast.error(`Material Action Failed. ${error.message}`);
    }
  };

  return (
    <div className="row">
      <div className="col-12 mb-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-6">
              <div className="card">
                <div className="card-header">
                  <h5>Customer info</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 d-flex gap-2 mb-3">
                      <TextField
                        label="Search Customer"
                        placeholder="Search the customer by mobile or name"
                        value={customerSearchQuery}
                        onChange={(e) => setCustomerSearchQuery(e.target.value)}
                      />
                      <button type="button" aria-label="search_customer" onClick={() => handleSearchCustomer()}>
                        <span>
                          <FaSearch />
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <RHFTextField<RentOrderSchema> label="Mobile" name="customer.mobile" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<RentOrderSchema> label="Name" name="customer.name" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDropDown<RentOrderSchema> options={salesPeople} name="salesPerson" label="Sales Person" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDatePicker<RentOrderSchema> name="rentDate" label="Rent Date" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDatePicker<RentOrderSchema> name="returnDate" label="Return Date" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card">
                <div className="card-header">
                  <h5>Billing info</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-6 mb-3">
                      <RHFTextField<RentOrderSchema> label="Total" name="totalPrice" disabled />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDropDown<RentOrderSchema> options={paymentOptions} name="paymentType" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<RentOrderSchema> label="Advance" name="advPayment" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<RentOrderSchema> label="Discount" name="discount" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<RentOrderSchema> label="SubTotal" name="subTotal" disabled />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<RentOrderSchema> label="Balance" name="balance" disabled />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="secondary-button"
                      type="submit"
                      //   onClick={handleCancelOrder}
                    >
                      Cancel Order
                    </button>
                    <button className="primary-button" type="submit" onClick={() => console.log('btn clicked')}>
                      Rentout
                      {/* {variant === "create" ? "Create Order " : "Edit Order "} */}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="col-12">
        <div className="row">
          <div className="col-6">
            <div className="card">
              <div className="card-header">
                <h5>Add rent Items</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 d-flex gap-2 mb-3">
                    <TextField
                      label="Search Product"
                      placeholder="Search the product by barcode"
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                    />
                    <button type="button" aria-label="search_product" onClick={() => handleSearchProduct()}>
                      <span>
                        <FaSearch />
                      </span>
                    </button>
                  </div>
                  <div className="col-12 mb-3 d-flex gap-4">
                    <div className="col-2">
                      <TextField label="Color" value={rentItemDetails.color} inputProps={{ readOnly: true }} />
                    </div>
                    <div className="col-2">
                      <TextField label="Size" type="number" value={rentItemDetails.size ?? ''} inputProps={{ readOnly: true }} />
                    </div>
                    <div className="col-3">
                      <TextField label="Description" value={rentItemDetails.description} inputProps={{ readOnly: true }} />
                    </div>
                    <div className="col-3">
                      <TextField
                        label="Hand length"
                        value={rentItemDetails.handLength}
                        onChange={(e) => handleRentItemDetailsChange(RentItemDetailTypes.handLength, e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-12 mb-3 d-flex gap-4">
                    <div className="col-9">
                      <TextField
                        label="Notes"
                        value={rentItemDetails.notes}
                        onChange={(e) => handleRentItemDetailsChange(RentItemDetailTypes.notes, e.target.value)}
                      />
                    </div>
                    <div className="col-2">
                      <TextField label="Amount" type="number" value={rentItemDetails.amount} onChange={(e) => handleAmountChange(e)} />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    className="secondary-button mx-2"
                    type="button"
                    // disabled={isAddItemButtonDisabled}
                    onClick={() => {
                      setRentItemDetails(initialRentItemDetails);
                    }}
                  >
                    Clear Item
                  </button>
                  <button
                    className="primary-button"
                    type="button"
                    // disabled={isAddItemButtonDisabled}
                    onClick={handleRentItemAdd}
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card  h-100">
              <div className="card-body">
                <MemoizedTable<RentItemDetails> rowData={rowData} colDefs={colDefs} defaultColDef={defaultColDef} pagination={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <button onClick={() => setOpen(true)}>Add products to Order</button> */}
    </div>
  );
};

export default NewRentOut;
