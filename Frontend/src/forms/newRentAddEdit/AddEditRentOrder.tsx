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
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';
import RHFDropDown from '../../components/customFormComponents/customDropDown/RHFDropDown';
import RHFDatePicker from '../../components/customFormComponents/customDatePicker/RHFDatePricker';
import PaymentType from '../../enums/PaymentType';
import { RentOrderSchema } from '../formSchemas/rentOutSchema';
import { useAddNewRentOrderMutation, useLazySearchCustomerQuery } from '../../redux/features/orders/orderApiSlice';
import { ApiResponseError } from '../../types/common';
import { useLazySearchProductQuery } from '../../redux/features/product/productApiSlice';
import { RentItemDetails } from '../../types/rentOrder';
import { RentItemDetailTypes } from '../../enums/RentItemDetails';
import MemoizedTable from '../../components/agGridTable/Table';
import RentItemDetailsRenderer from '../../components/agGridTable/customComponents/RentItemDetailsRenderer';

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
  color: '',
  size: undefined,
  description: '',
  handLength: '',
  notes: '',
  amount: 0,
  productId: undefined,
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

  const [triggerProductSearch, { data: product, error: productSearchError, isLoading: productDataLoading }] = useLazySearchProductQuery();

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
    { headerName: 'Barcode', field: 'productId' },
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
  ];

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

  const handleRentItemDetailsChange = (key: string, value: string | number) => {
    switch (key) {
      case RentItemDetailTypes.color:
        setRentItemDetails({ ...rentItemDetails, color: value as string });
        break;
      case RentItemDetailTypes.size:
        setRentItemDetails({ ...rentItemDetails, size: value as number });
        break;
      case RentItemDetailTypes.description:
        setRentItemDetails({ ...rentItemDetails, description: value as string });
        break;
      case RentItemDetailTypes.handLength:
        setRentItemDetails({ ...rentItemDetails, handLength: value as string });
        break;
      case RentItemDetailTypes.notes:
        setRentItemDetails({ ...rentItemDetails, notes: value as string });
        break;
      case RentItemDetailTypes.amount:
        setRentItemDetails({ ...rentItemDetails, amount: value as number });
        break;
      default:
        toast.error(`No key found for ${key} in Rent item details`);
        break;
    }
  };

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
    if (productSearchError) {
      let errorMessage = 'An unknown error occurred';
      if ('status' in productSearchError) {
        // error is FetchBaseQueryError
        const err = productSearchError as ApiResponseError;
        errorMessage = err.data.error ?? 'Something went wrong';
      } else if (productSearchError instanceof Error) {
        // error is SerializedError
        errorMessage = productSearchError.message;
      }
      toast.error(errorMessage);
    }
    if (product) {
      toast.success('Product fetched successfully.');
      setRentItemDetails({
        ...rentItemDetails,
        description: product.measurement?.style,
        color: product.color ?? '',
        size: product.size,
        productId: product?.productId,
      });
      clearErrors();
    }
  }, [productSearchError, product]);

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
        console.log(data)
        const response = await addRentOrder(data);
        if (response.error) {
          toast.error(`Order Adding Failed`);
          console.log(response.error);
        } else {
          const newOrderId = response.data.orderId;
          toast.success('New order Added.');
          reset();
          window.open(`http://localhost:8000/api/v1/invoice/${newOrderId}`, '_blank');
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
                      <TextField
                        label="Color"
                        value={rentItemDetails.color}
                        inputProps={{ readOnly: true }}
                        onChange={(e) => handleRentItemDetailsChange(RentItemDetailTypes.color, e.target.value)}
                      />
                    </div>
                    <div className="col-2">
                      <TextField
                        label="Size"
                        value={rentItemDetails.size}
                        inputProps={{ readOnly: true }}
                        onChange={(e) => handleRentItemDetailsChange(RentItemDetailTypes.size, e.target.value)}
                      />
                    </div>
                    <div className="col-3">
                      <TextField
                        label="Description"
                        value={rentItemDetails.description}
                        inputProps={{ readOnly: true }}
                        onChange={(e) => handleRentItemDetailsChange(RentItemDetailTypes.size, e.target.value)}
                      />
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
                      <TextField
                        label="Amount"
                        type="number"
                        value={rentItemDetails.amount}
                        onChange={(e) => handleRentItemDetailsChange(RentItemDetailTypes.amount, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    className="secondary-button mx-2"
                    type="button"
                    // disabled={isAddItemButtonDisabled}
                    onClick={() => setRentItemDetails(initialRentItemDetails)}
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
                <MemoizedTable rowData={rowData} colDefs={colDefs} pagination={false} />
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
