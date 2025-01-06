/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { Modal, TextField } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import { SubmitHandler, useFormContext, useWatch } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ColDef } from 'ag-grid-community';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';
import RHFDropDown from '../../components/customFormComponents/customDropDown/RHFDropDown';
import RHFDatePicker from '../../components/customFormComponents/customDatePicker/RHFDatePricker';
import { defaultRentOrderValues, rentOrderSchema, RentOrderSchema } from '../formSchemas/rentOrderSchema';
import { useLazySearchCustomerQuery } from '../../redux/features/orders/orderApiSlice';
import { useLazySearchRentItemQuery } from '../../redux/features/product/productApiSlice';
import { RentItemDetails } from '../../types/rentItem';
import { RentItemDetailTypes } from '../../enums/RentItemDetails';
import MemoizedTable from '../../components/agGridTable/Table';
import RentItemDetailsRenderer from '../../components/agGridTable/customComponents/RentItemDetailsRenderer';
import ProductType from '../../enums/ProductType';
import {
  useAddNewRentOrderMutation,
  useDeleteRentOrderMutation,
  useLazyGetSingleRentOrderQuery,
  useUpdateSingleRentOrderMutation,
} from '../../redux/features/rentOrder/rentOrderApiSlice';
import SimpleActionButton from '../../components/agGridTable/customComponents/SimpleActionButton';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks/reduxHooks';
import { allUsers } from '../../redux/features/auth/authSlice';
import getUserRoleBasedOptions from '../../utils/userUtils';
import { Roles } from '../../enums/Roles';
import StakeOptions from '../../enums/StakeOptions';
import { setLoading } from '../../redux/features/common/commonSlice';
import CustomMobileWithOtp from '../../components/customFormComponents/customMobileWithOtp/CustomMobileWithOtp';
import suitTypeOptions from '../../consts/suitTypes';
import PrintShopBill from '../printshopbill/PrintShopBill';
import { selectSavedSaleOrder, setOrderForm } from '../../redux/features/orders/orderSlice';
import paymentOptions from '../../consts/paymentOptions';
import { stakeOptions } from '../../consts/rentOrder';

const initialRentItemDetails: RentItemDetails = {
  rentItemId: '0',
  color: '',
  size: undefined,
  description: '',
  handLength: '',
  notes: '',
  amount: 0,
  itemType: ProductType.Coat,
};

const NewRentOut = () => {
  const { control, unregister, watch, reset, setValue, handleSubmit, getValues, clearErrors } = useFormContext<RentOrderSchema>();

  const [triggerCustomerSearch, { data: customer, isLoading: isCustomerLoading }] = useLazySearchCustomerQuery();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const location = useLocation();
  const { isFromSalesOrder } = location?.state || {}; // Retrieve the state

  const [triggerProductSearch, { data: rentItem, isLoading: rentItemLoading }] = useLazySearchRentItemQuery();

  const [getRentOrderData, { data: singleRentOrderData, isLoading: rentOrderLoading }] = useLazyGetSingleRentOrderQuery();
  const [addRentOrder, { data, isLoading: addingRentOrder }] = useAddNewRentOrderMutation();
  const [updateRentOrder, { data: updateData, isLoading: updatingOrder }] = useUpdateSingleRentOrderMutation();
  const [deleteRentOrder, { data: deleteData, isLoading: isDeleting, errors }] = useDeleteRentOrderMutation();

  useEffect(() => {
    dispatch(setLoading(isCustomerLoading));
  }, [isCustomerLoading]);
  useEffect(() => {
    dispatch(setLoading(rentItemLoading));
  }, [rentItemLoading]);
  useEffect(() => {
    dispatch(setLoading(addingRentOrder));
  }, [addingRentOrder]);
  useEffect(() => {
    dispatch(setLoading(updatingOrder));
  }, [updatingOrder]);

  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  const [productSearchQuery, setProductSearchQuery] = useState('');

  const [rentItemDetails, setRentItemDetails] = useState<RentItemDetails>(initialRentItemDetails);

  const [selectedRentItem, setSelectedRentItem] = useState({});

  const savedSalesOrder = useAppSelector(selectSavedSaleOrder);

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [rowData, setRowData] = useState<RentItemDetails[]>([]);

  const [rentItemResponse, setRentItemResponse] = useState();

  const handleClose = () => {
    setOpen(false);
  };

  const openPrint = (id: any) => {
    setOpen(true);
    setSelectedId(id);
  };

  const total = useWatch({ control, name: 'totalPrice' });
  const advance = useWatch({ control, name: 'advPayment' });
  const discount = useWatch({ control, name: 'discount' });
  const variant = useWatch({ control, name: 'variant' });
  const stakeOption = useWatch({ control, name: 'stakeOption' });

  const users = useAppSelector(allUsers);

  const salesPeople = getUserRoleBasedOptions(users, Roles.SalesPerson);

  const handleRemove = (id: string) => {
    const filteredRowData = rowData.filter((row) => row.rentItemId !== id);
    setRowData(filteredRowData);
    setRentItemResponse(null);
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

  const handleSearchCustomer = async () => {
    const response = await triggerCustomerSearch(customerSearchQuery).unwrap();

    if (response.data) {
      toast.success('Rent Item fetched!');
    }
  };
  const handleSearchProduct = async () => {
    const response = await triggerProductSearch(productSearchQuery).unwrap();

    if (response) {
      setRentItemResponse(response);
    }
  };

  const handleRentItemAdd = () => {
    if (isFromSalesOrder && rentItemDetails.rentItemId) {
      setSelectedRentItem(rentItemDetails);
    }
    const isDuplicate = rowData.some((item) => item.rentItemId === rentItemDetails.rentItemId);

    if (isDuplicate) {
      // Display error message if duplicate found
      toast.error('Item with this Barcode already exists.');
      // Optionally, you could use a toast or other UI feedback mechanism here
      return;
    }

    setRowData((prev) => [...prev, rentItemDetails]);
    // if (isFromSalesOrder) {
    //   const updatedOrderDetails = savedSalesOrder.formData.orderDetails.map((detail) => {
    //     if (detail.rentItems) {
    //       return {
    //         ...detail,
    //         rentItems: detail.rentItems.map((item) => (item.rentItemId === savedSalesOrder.selectedItemId ? rentItemDetails : item)),
    //       };
    //     }
    //     return detail;
    //   });

    //   const updatedSalesOrder = {
    //     ...savedSalesOrder,
    //     formData: {
    //       ...savedSalesOrder.formData,
    //       orderDetails: updatedOrderDetails,
    //     },
    //   };

    //   setOrderForm(updatedSalesOrder);
    // }
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
    const rentDate = data?.rentDate ? new Date(data.rentDate) : null;
    const returnDate = data?.returnDate ? new Date(data.returnDate) : null;
    return { ...data, rentDate, returnDate };
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the form submission
      handleSearchCustomer();
    }
  };

  const handleKeyPressProductAdd = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the form submission
      handleRentItemAdd();
    }
  };

  const handleKeyPressProductSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the form submission
      handleSearchProduct();
    }
  };

  const handleRenderStakeOptions = () => {
    if (stakeOption === StakeOptions.No) {
      return null;
    }
    if (stakeOption === StakeOptions.NIC) {
      return <RHFTextField<RentOrderSchema> label="NIC Number" name="nicNumber" />;
    }
    if (stakeOption === StakeOptions.Deposit) {
      return <RHFTextField<RentOrderSchema> label="Deposit Amount" name="stakeAmount" />;
    }
  };

  const saveAndBackToSalesOrder = (newRentOrderId: string) => {
    if (selectedRentItem) {
      const updatedOrderDetails = savedSalesOrder?.orderDetails?.map((order) => ({
        ...order,
        rentItems: order.rentItems.map((item) => (item.rentItemId === savedSalesOrder.selectedItemId ? selectedRentItem : item)),
      }));

      dispatch(
        setOrderForm({
          ...savedSalesOrder,
          formData: { ...savedSalesOrder.formData, linkedRentOrder: newRentOrderId },
          orderDetails: updatedOrderDetails,
          selectedItemId: selectedRentItem.rentItemId,
        })
      );
      navigate(`/secured/addSalesOrder/${savedSalesOrder.currentOrderId}`, { state: { isFromRentOrder: true } });
    }
  };

  const getSaveButtonTxt = () => {
    let btnLabel = '';
    if (isFromSalesOrder) {
      btnLabel = 'Save Order';
    } else if (variant === 'create') {
      btnLabel = 'Create Order';
    } else if (variant === 'edit') {
      btnLabel = 'Update Order';
    }
    return btnLabel;
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
    } else if (savedSalesOrder) {
      const formData = {
        customer: savedSalesOrder?.formData?.customer,
        salesPerson: savedSalesOrder?.formData?.salesPerson,
        rentDate: savedSalesOrder?.formData?.deliveryDate,
        variant: savedSalesOrder?.formData.linkedRentOrder ? 'edit' : 'create',
        linkedSalesOrderId: savedSalesOrder?.currentOrderId,
        totalPrice: 0,
        subTotal: 0,
        discount: 0,
        advPayment: 0,
        balance: 0,
        rentOrderDetails: [],
      };

      reset(formData);
    } else {
      handleResetRentOrder();
    }
  }, [rentOrderId, savedSalesOrder]);

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
  }, [customer]);

  useEffect(() => {
    if (rentItemResponse) {
      setRentItemDetails((prevDetails) => ({
        ...prevDetails,
        description: rentItemResponse.description,
        color: rentItemResponse.color,
        size: rentItemResponse.size,
        itemType: rentItemResponse.itemType,
        rentItemId: rentItemResponse.rentItemId,
      }));
      clearErrors();
    }
  }, [rentItemResponse]);

  const handleValidateData = () => {
    const formData = getValues();

    const result = rentOrderSchema.safeParse(formData);
    console.log(formData);
    console.log(result);
  };

  const handleCancelOrder = () => {
    if (isFromSalesOrder) {
      navigate(`/secured/addSalesOrder/${savedSalesOrder.currentOrderId}`);
    } else {
      reset(defaultRentOrderValues);
      setRowData([]);
      setRentItemDetails(initialRentItemDetails);
      setRentItemResponse(null);
    }
  };

  const onSubmit: SubmitHandler<RentOrderSchema> = async (data) => {
    try {
      let newOrderId;
      if (variant === 'edit') {
        const response = await updateRentOrder(data);
        if (response.error) {
          console.log(response.error);
          return;
        }
        toast.success('Order Updated!');
        newOrderId = response.data.data.rentOrderId;
      } else {
        const response = await addRentOrder(data);
        if (response.error) {
          console.log(response.error);
          return;
        }
        newOrderId = response.data.rentOrderId;
        toast.success('New Rent Order Added successfully');
      }
      if (!isFromSalesOrder) {
        openPrint(newOrderId);
        handleResetRentOrder();
      } else {
        saveAndBackToSalesOrder(newOrderId);
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
                    <div className="col-7 d-flex gap-2 mb-3 align-items-end">
                      <TextField
                        disabled={isFromSalesOrder}
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
                    {/* <div className="col-6 d-flex gap-2 mb-3 align-items-end">
                      <RHFDropDown<RentOrderSchema> options={stores} name="store" label="Store" />
                    </div> */}
                  </div>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <RHFTextField<RentOrderSchema> label="Name" name="customer.name" disabled={isFromSalesOrder} />
                    </div>
                    <CustomMobileWithOtp<RentOrderSchema> label="Mobile" name="customer.mobile" disabled={isFromSalesOrder} />
                    <CustomMobileWithOtp<RentOrderSchema> label="Secondary Mobile" name="customer.secondaryMobile" disabled={isFromSalesOrder} />
                    <CustomMobileWithOtp<RentOrderSchema> label="Other Mobile" name="customer.otherMobile" disabled={isFromSalesOrder} />
                    <div className="col-6 mb-3">
                      <RHFDropDown<RentOrderSchema> options={salesPeople} name="salesPerson" label="Sales Person" disabled={isFromSalesOrder} />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDatePicker<RentOrderSchema> name="rentDate" label="Rent Date" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDatePicker<RentOrderSchema> name="returnDate" label="Return Date" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDropDown<RentOrderSchema> options={suitTypeOptions} name="suitType" label="SuitType" />
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
                      <RHFDropDown<RentOrderSchema> label="Payment Options" options={paymentOptions} name="paymentType" disabled={isFromSalesOrder} />
                    </div>

                    <div className="col-6 mb-3">
                      <RHFTextField<RentOrderSchema> label="Advance" name="advPayment" disabled={isFromSalesOrder} />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<RentOrderSchema> label="Discount" name="discount" disabled={isFromSalesOrder} />
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
                    <div className="col-6 mb-3">{handleRenderStakeOptions()}</div>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button className="secondary-button" type="button" onClick={handleCancelOrder}>
                      {isFromSalesOrder ? 'Back to Sales Order' : 'Cancel Order'}
                    </button>
                    {/* <button className="secondary-button" type="button" onClick={handleValidateData}>
                      validate Order
                    </button> */}
                    {isFromSalesOrder ? (
                      <button className="primary-button" type="submit">
                        {getSaveButtonTxt()}
                      </button>
                    ) : (
                      <button className="primary-button" type="submit">
                        {variant === 'create' ? 'Create Order ' : 'Edit Order '}
                      </button>
                    )}
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
                        <TextField
                          label="Amount"
                          type="number"
                          value={rentItemDetails.amount}
                          disabled={isFromSalesOrder}
                          onChange={(e) => handleAmountChange(e)}
                          onKeyDown={handleKeyPressProductAdd}
                        />
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
                      setRentItemResponse(null);
                    }}
                  >
                    Clear Item
                  </button>
                  <button className="primary-button" type="button" onClick={handleRentItemAdd}>
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
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div>
          <PrintShopBill id={selectedId} handleClose={handleClose} />
        </div>
      </Modal>
    </div>
  );
};

export default NewRentOut;
