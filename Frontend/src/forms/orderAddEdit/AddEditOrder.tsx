/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { useCallback, useEffect, useState } from 'react';
import { Modal, TextField } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'sonner';
import { FormProvider, SubmitHandler, useForm, useFormContext, useWatch } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';
import { OrderSchema } from '../formSchemas/orderSchema';
import { useAddNewOrderMutation, useLazySearchCustomerQuery } from '../../redux/features/orders/orderApiSlice';
import { ApiResponseError, OptionCheckBox } from '../../types/common';
import RHFDatePicker from '../../components/customFormComponents/customDatePicker/RHFDatePricker';
import RHFDropDown from '../../components/customFormComponents/customDropDown/RHFDropDown';
import PaymentType from '../../enums/PaymentType';
import AddEditProduct from '../productAddEdit/AddEditProduct';
import { ProductSchema, defaultProductValues, productSchema } from '../formSchemas/productSchema';
import CheckBoxGroup from '../../components/customFormComponents/checkboxGroup/CheckBoxGroup';
import Table from '../../components/agGridTable/Table';
import ProductType from '../../enums/ProductType';
import { MeasurementSchema, defaultMeasurementValues, measurementSchema } from '../formSchemas/measurementSchema';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks/reduxHooks';
import { setProductType, setSelectedProduct } from '../../redux/features/product/productSlice';
import { selectOrderItems, setOrderProducts } from '../../redux/features/orders/orderSlice';
import { useGetAllProductsQuery } from '../../redux/features/product/productApiSlice';
import mapProducts from '../../utils/productUtils';
import ActionButtons from '../../components/agGridTable/customComponents/ActionButtons';
import ProductRenderer from '../../components/agGridTable/customComponents/ProductRenderer';
import AddEditMeasurement from '../measurementAddEdit/AddEditMeasurement';

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

const initialProductOptions = [
  {
    id: ProductType.Shirt,
    label: 'Shirt',
    checked: false,
  },
  {
    id: ProductType.Coat,
    label: 'Coat',
    checked: false,
  },
  {
    id: ProductType.Trouser,
    label: 'Trouser',
    checked: false,
  },
  {
    id: ProductType.WestCoat,
    label: 'West Coat',
    checked: false,
  },
  {
    id: ProductType.Cravat,
    label: 'Cravat',
    checked: false,
  },
  {
    id: ProductType.Bow,
    label: 'Bow',
    checked: false,
  },
  {
    id: ProductType.Tie,
    label: 'Tie',
    checked: false,
  },
];

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

// const rowData = [
//   { product: "Coat", qty: 1, amount: 1000 },
//   { product: "Coat", qty: 1, amount: 1000 },
//   { product: "Coat", qty: 1, amount: 1000 },
// ];

const AddEditOrder = () => {
  const { control, unregister, watch, reset, setValue, handleSubmit, getValues, clearErrors } = useFormContext<OrderSchema>();

  const dispatch = useAppDispatch();

  const methods = useForm<ProductSchema>({
    mode: 'all',
    resolver: zodResolver(productSchema),
    defaultValues: defaultProductValues,
  });
  const measurementMethods = useForm<MeasurementSchema>({
    mode: 'all',
    resolver: zodResolver(measurementSchema),
    defaultValues: defaultMeasurementValues,
  });

  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [openMeasurement, setOpenMeasurement] = useState(false);
  const [description, setDescription] = useState('');
  const [productOptions, setProductOptions] = useState<OptionCheckBox[]>(initialProductOptions);

  const total = useWatch({ control, name: 'totalPrice' });
  const advance = useWatch({ control, name: 'advPayment' });
  const discount = useWatch({ control, name: 'discount' });
  const variant = useWatch({ control, name: 'variant' });

  const orderItems = useAppSelector(selectOrderItems);
  const isAddItemButtonDisabled = description.trim() === '' || !productOptions.some((option) => option.checked);

  const [trigger, { data: customer, error: customerSearchError, isLoading }] = useLazySearchCustomerQuery();
  const { data: productsData, error, isLoading: productsLoading } = useGetAllProductsQuery({});

  const [addOrder, { data: newOrder }] = useAddNewOrderMutation();

  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  const handleClose = useCallback(() => setOpen(false), []);
  const handleMeasurementClose = useCallback(() => setOpenMeasurement(false), []);

  const handleOpenMeasurement = useCallback((productId: number) => {
    setOpenMeasurement(true);
    dispatch(setSelectedProduct(productId));
  }, []);

  const colDefs = [
    {
      headerName: 'Product',
      field: 'product',
      cellRenderer: ProductRenderer,
      cellRendererParams: (params) => ({
        data: params.data,
        handleOpenMeasurement,
      }),
      autoHeight: true,
    },
    { headerName: 'Amount', field: 'amount' },
    {
      headerName: 'Actions',
      field: 'action',
      cellRenderer: ActionButtons,
      cellRendererParams: (params) => ({
        productId: params.data?.productId,
        action: 'delete',
      }),
    },
  ];

  const handleSearchCustomer = () => {
    trigger(customerSearchQuery);
  };

  const handleCheckBoxSelect = (id: string) => {
    setProductOptions((prevOptions) => {
      const newOptions = prevOptions.map((option) => {
        if (option.id === id) {
          if (!option.checked) {
            // Only set open to true if the checkbox is being checked
            setOpen(true);
          }
          return { ...option, checked: !option.checked };
        }
        return option;
      });
      return newOptions;
    });
    dispatch(setProductType(id));
  };

  const handleAddItems = () => {
    dispatch(setOrderProducts(description));
    setProductOptions(initialProductOptions);
    setDescription('');
  };

  const clearOrderItems = () => {
    setProductOptions(initialProductOptions);
    setDescription('');
  };

  const handleCancelOrder = () => {
    reset();
  };

  useEffect(() => {
    if (productsData) {
      const newRowData = mapProducts(orderItems, productsData);
      setRowData(newRowData);
      const totalAmount = newRowData.reduce((sum, row) => sum + (row.amount || 0), 0);
      setValue('totalPrice', totalAmount);
    }
    if (orderItems) {
      setValue('orderDetails', orderItems);
    }
  }, [productsData, orderItems]);

  useEffect(() => {
    const validDiscount = discount ?? 0;
    const validAdvance = advance ?? 0;
    const subTotal = total - validDiscount;
    const balance = subTotal - validAdvance;
    setValue('subTotal', subTotal);
    setValue('balance', balance);
  }, [total, discount, advance]);

  useEffect(() => {
    const sub = watch((value) => {
      console.log(value);
    });

    return () => {
      sub.unsubscribe();
    };
  }, [watch]);

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
  }, [customerSearchError, customer]);

  const onSubmit: SubmitHandler<OrderSchema> = async (data) => {
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
        const response = await addOrder(data);
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
              <div className="card h-100">
                <div className="card-header">
                  <h5>Customer info</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 d-flex gap-2 mb-3">
                      <TextField
                        label="Search Customer"
                        size="small"
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
                      <RHFTextField<OrderSchema> label="Mobile" name="customer.mobile" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<OrderSchema> label="Name" name="customer.name" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDropDown<OrderSchema> options={salesPeople} name="salesPerson" label="Sales Person" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDatePicker<OrderSchema> name="orderDate" label="Order Date" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDatePicker<OrderSchema> name="deliveryDate" label="Delivery Date" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDatePicker<OrderSchema> name="weddingDate" label="Wedding Date" />
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
                      <RHFTextField<OrderSchema> label="Total" name="totalPrice" disabled />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDropDown<OrderSchema> options={paymentOptions} name="paymentType" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<OrderSchema> label="Advance" name="advPayment" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<OrderSchema> label="Discount" name="discount" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<OrderSchema> label="SubTotal" name="subTotal" disabled />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<OrderSchema> label="Balance" name="balance" disabled />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button className="secondary-button" type="submit" onClick={handleCancelOrder}>
                      Cancel Order
                    </button>
                    <button className="primary-button" type="submit" onClick={() => console.log('btn clicked')}>
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
            <div className="card">
              <div className="card-header">
                <h5>Add order Items</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 mb-3">
                    <TextField label="Description" value={description} onChange={(e) => setDescription(e?.target?.value)} />
                  </div>
                </div>
                <CheckBoxGroup options={productOptions} handleCheckBoxSelect={handleCheckBoxSelect} />
                <div className="d-flex justify-content-end">
                  <button className="secondary-button mx-2" type="button" disabled={isAddItemButtonDisabled} onClick={clearOrderItems}>
                    Clear Items
                  </button>
                  <button className="primary-button" type="button" disabled={isAddItemButtonDisabled} onClick={() => handleAddItems()}>
                    Add Items
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <Table rowData={rowData} colDefs={colDefs} pagination={false} />
          </div>
        </div>
      </div>
      {/* <button onClick={() => setOpen(true)}>Add products to Order</button> */}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div>
          <FormProvider {...methods}>
            <div>
              <AddEditProduct handleClose={handleClose} />
              <DevTool control={methods.control} />
            </div>
          </FormProvider>
        </div>
      </Modal>
      <Modal open={openMeasurement} onClose={handleMeasurementClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div>
          <FormProvider {...measurementMethods}>
            <div>
              <AddEditMeasurement handleClose={handleMeasurementClose} />
              <DevTool control={measurementMethods.control} />
            </div>
          </FormProvider>
        </div>
      </Modal>
    </div>
  );
};

export default AddEditOrder;
