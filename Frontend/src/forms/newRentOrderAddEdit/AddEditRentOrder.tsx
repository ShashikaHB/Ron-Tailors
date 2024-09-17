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
import { useParams } from 'react-router-dom';
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';
import RHFDropDown from '../../components/customFormComponents/customDropDown/RHFDropDown';
import RHFDatePicker from '../../components/customFormComponents/customDatePicker/RHFDatePricker';
import PaymentType from '../../enums/PaymentType';
import { defaultRentOrderValues, rentOrderSchema, RentOrderSchema } from '../formSchemas/rentOrderSchema';
import { useLazySearchCustomerQuery } from '../../redux/features/orders/orderApiSlice';
import { useLazySearchRentItemQuery } from '../../redux/features/product/productApiSlice';
import { RentItemDetails } from '../../types/rentItem';
import { RentItemDetailTypes } from '../../enums/RentItemDetails';
import MemoizedTable from '../../components/agGridTable/Table';
import RentItemDetailsRenderer from '../../components/agGridTable/customComponents/RentItemDetailsRenderer';
import ProductType from '../../enums/ProductType';
import { useAddNewRentOrderMutation, useLazyGetSingleRentOrderQuery, useUpdateSingleRentOrderMutation } from '../../redux/features/rentOrder/rentOrderApiSlice';
import SimpleActionButton from '../../components/agGridTable/customComponents/SimpleActionButton';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks/reduxHooks';
import { allUsers } from '../../redux/features/auth/authSlice';
import getUserRoleBasedOptions from '../../utils/userUtils';
import { Roles } from '../../enums/Roles';
import stores from '../../consts/stores';
import StakeOptions from '../../enums/StakeOptions';
import { setLoading } from '../../redux/features/common/commonSlice';

// const salesPeople = [
//   {
//     value: 0,
//     label: 'Select a Sales Person',
//   },
//   {
//     value: 112,
//     label: 'shashika',
//   },
//   {
//     value: 114,
//     label: 'Nimal',
//   },
// ];

const initialRentItemDetails: RentItemDetails = {
  rentItemId: 0,
  color: '',
  size: undefined,
  description: '',
  handLength: '',
  notes: '',
  amount: 0,
  itemType: ProductType.Coat,
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

const stakeOptions = [
  {
    value: StakeOptions.NIC,
    label: 'NIC',
  },
  {
    value: StakeOptions.Deposit,
    label: 'Card',
  },
];

const NewRentOut = () => {
  const { control, unregister, watch, reset, setValue, handleSubmit, getValues, clearErrors } = useFormContext<RentOrderSchema>();

  const [triggerCustomerSearch, { data: customer, isLoading }] = useLazySearchCustomerQuery();

  const dispatch = useAppDispatch();

  const [triggerProductSearch, { data: rentItem, isLoading: rentItemLoading }] = useLazySearchRentItemQuery();

  const [getRentOrderData, { data: singleRentOrderData }] = useLazyGetSingleRentOrderQuery();
  const [addRentOrder, { data, isLoading: rentOrderLoading }] = useAddNewRentOrderMutation();
  const [updateRentOrder] = useUpdateSingleRentOrderMutation();

  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  const [productSearchQuery, setProductSearchQuery] = useState('');

  const [rentItemDetails, setRentItemDetails] = useState<RentItemDetails>(initialRentItemDetails);

  const [rowData, setRowData] = useState<RentItemDetails[]>([]);

  const total = useWatch({ control, name: 'totalPrice' });
  const advance = useWatch({ control, name: 'advPayment' });
  const discount = useWatch({ control, name: 'discount' });
  const variant = useWatch({ control, name: 'variant' });
  const stakeOption = useWatch({ control, name: 'stakeOption' });

  const users = useAppSelector(allUsers);

  const salesPeople = getUserRoleBasedOptions(users, Roles.SalesPerson);

  const handleRemove = (id: number) => {
    const filteredRowData = rowData.filter((row) => row.rentItemId !== id);
    setRowData(filteredRowData);
  };

  const { rentOrderId } = useParams();

  const colDefs = [
    { headerName: 'Barcode', field: 'rentItemId' as keyof RentItemDetails },
    {
      headerName: 'Order Description',
      field: 'description' as keyof RentItemDetails,
      cellRenderer: RentItemDetailsRenderer,
      cellRendererParams: (params: any) => ({
        data: params.data,
      }),
      autoHeight: true,
      minWidth: 250,
    },
    { headerName: 'Amount', field: 'amount' as keyof RentItemDetails },
    {
      headerName: '',
      cellRenderer: SimpleActionButton,
      cellRendererParams: {
        handleRemove,
        idField: 'rentItemId',
      },
    },
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
    setProductSearchQuery('');
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

  const getUpdatingFormattedData = (data: any) => {
    const salesPerson = data?.salesPerson?.userId;
    const rentDate = data?.rentDate ? new Date(data.rentDate) : null;
    const returnDate = data?.returnDate ? new Date(data.returnDate) : null;
    return { ...data, salesPerson, rentDate, returnDate };
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the form submission
      handleSearchCustomer();
    }
  };

  const handleKeyPressProductSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the form submission
      handleSearchProduct();
    }
  };

  useEffect(() => {
    dispatch(setLoading(rentOrderLoading));
  }, [rentOrderLoading]);

  useEffect(() => {
    if (rentOrderId) {
      // Fetch and populate the order data for editing
      getRentOrderData(rentOrderId).then((response) => {
        if (response.data) {
          reset(getUpdatingFormattedData(response.data)); // Populate the form with fetched data
          setRowData(response.data.rentOrderDetails);
        }
      });
    } else {
      handleResetRentOrder();
    }
  }, [rentOrderId, singleRentOrderData]);

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
    if (customer) {
      setValue('customer.name', customer.name);
      setValue('customer.mobile', customer.mobile);
      clearErrors();
    }
  }, [customer, setValue, clearErrors, customerSearchQuery]);

  useEffect(() => {
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
  }, [rentItem, productSearchQuery]);

  const handleValidateData = () => {
    const formData = getValues();

    const result = rentOrderSchema.safeParse(formData);

    console.log(result);
  };

  const onSubmit: SubmitHandler<RentOrderSchema> = async (data) => {
    try {
      const newWindow = window.open('', '_blank');
      if (variant === 'edit') {
        const response = await updateRentOrder(data);
        if (response.error) {
          console.log(response.error);
        } else {
          toast.success('Order Updated!');
          reset();
        }
      } else {
        console.log(data);
        const response = await addRentOrder(data);
        if (response.error) {
          console.log(response.error);
        } else {
          const newOrderId = response.data.rentOrderId;
          toast.success('New Rent Order Added successfully');
          handleResetRentOrder();
          const baseUrl = import.meta.env.VITE_BASE_URL;
          const invoiceUrl = `${baseUrl}/api/v1/invoice/rentOrder/${newOrderId}`;
          if (newWindow) {
            newWindow.location.href = invoiceUrl;
          }
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
                    <div className="col-6 d-flex gap-2 mb-3 align-items-end">
                      <RHFDropDown<RentOrderSchema> options={stores} name="store" label="Store" />
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
              <div className="card h-100">
                <div className="card-header">
                  <h5>Billing info</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-6 mb-3">
                      <RHFTextField<RentOrderSchema> label="Total" name="totalPrice" disabled />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDropDown<RentOrderSchema> label="Payment Options" options={paymentOptions} name="paymentType" />
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
                    <div className="col-6 mb-3">
                      <RHFDropDown<RentOrderSchema> label="Stake Options" options={stakeOptions} name="stakeOption" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<RentOrderSchema> label="Amount" name="stakeAmount" disabled={stakeOption === StakeOptions.NIC} />
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
                    <button className="primary-button" type="submit">
                      {variant === 'create' ? 'Create Order ' : 'Edit Order '}
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
            <div className="card h-100">
              <div className="card-header">
                <h5>Add rent Items</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 d-flex gap-2 mb-3 align-items-end">
                    <TextField
                      label="Search Product"
                      placeholder="Search the product by barcode"
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                      onKeyDown={handleKeyPressProductSearch}
                    />
                    <button className="icon-button" type="button" aria-label="search_product" onClick={() => handleSearchProduct()}>
                      <span>
                        <FaSearch />
                      </span>
                    </button>
                  </div>
                  <div className="col-12 mb-3 d-flex">
                    <div className="row gap-2 mx-0 g-0">
                      <div className="col">
                        <TextField label="Color" value={rentItemDetails.color} inputProps={{ readOnly: true }} />
                      </div>
                      <div className="col">
                        <TextField label="Size" type="number" value={rentItemDetails.size ?? ''} inputProps={{ readOnly: true }} />
                      </div>
                      <div className="col">
                        <TextField label="Description" value={rentItemDetails.description} inputProps={{ readOnly: true }} />
                      </div>
                      <div className="col">
                        <TextField
                          label="Hand length"
                          value={rentItemDetails.handLength}
                          onChange={(e) => handleRentItemDetailsChange(RentItemDetailTypes.handLength, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mb-3 d-flex gap-4">
                    <div className="row gap-2 mx-0 g-0 w-100">
                      <div className="col">
                        <TextField
                          label="Notes"
                          value={rentItemDetails.notes}
                          onChange={(e) => handleRentItemDetailsChange(RentItemDetailTypes.notes, e.target.value)}
                        />
                      </div>
                      <div className="col-4">
                        <TextField label="Amount" type="number" value={rentItemDetails.amount} onChange={(e) => handleAmountChange(e)} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    className="secondary-button mx-2"
                    type="button"
                    onClick={() => {
                      setRentItemDetails(initialRentItemDetails);
                    }}
                  >
                    Clear Item
                  </button>
                  <button className="primary-button" type="button" disabled={rentItemDetails.amount === 0} onClick={handleRentItemAdd}>
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="h-100">
              <div className="h-100">
                <MemoizedTable<RentItemDetails> rowData={rowData} colDefs={colDefs} defaultColDef={defaultColDef} pagination={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRentOut;
