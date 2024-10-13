/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { useCallback, useEffect, useState } from 'react';
import { capitalize, FormControl, FormGroup, FormLabel, MenuItem, Modal, Select, TextField } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'sonner';
import { FormProvider, SubmitHandler, useForm, useFormContext, useWatch } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'react-router-dom';
import { ICellRendererParams } from 'ag-grid-community';
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';
import { defaultOrderValues, orderSchema, OrderSchema } from '../formSchemas/orderSchema';
import {
  useAddNewOrderMutation,
  useLazyGetSingleSalesOrderQuery,
  useLazySearchCustomerQuery,
  useUpdateSalesOrderMutation,
} from '../../redux/features/orders/orderApiSlice';
import RHFDatePicker from '../../components/customFormComponents/customDatePicker/RHFDatePricker';
import RHFDropDown from '../../components/customFormComponents/customDropDown/RHFDropDown';
import Table from '../../components/agGridTable/Table';
import { MeasurementSchema, defaultMeasurementValues, measurementSchema } from '../formSchemas/measurementSchema';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks/reduxHooks';
import { setSelectedProduct } from '../../redux/features/product/productSlice';
import { removeSelectedCustomerId, setSelectedCustomerId } from '../../redux/features/orders/orderSlice';
import { useAddNewProductMutation } from '../../redux/features/product/productApiSlice';
import ProductRenderer from '../../components/agGridTable/customComponents/ProductRenderer';
import AddEditMeasurement from '../measurementAddEdit/AddEditMeasurement';
import stores from '../../consts/stores';
import { allUsers } from '../../redux/features/auth/authSlice';
import getUserRoleBasedOptions from '../../utils/userUtils';
import { Roles } from '../../enums/Roles';
import paymentOptions from '../../consts/paymentOptions';
import { productCategoryItemMap } from '../../consts/products';
import { CheckBoxWithInput } from '../../components/customFormComponents/checkboxGroup/CheckBoxGroup';
import { ProductCategory } from '../../enums/ProductType';
import { setLoading } from '../../redux/features/common/commonSlice';
import SelectRentItem from '../selectRentItem/SelectRentItem';
import CustomMobileWithOtp from '../../components/customFormComponents/customMobileWithOtp/CustomMobileWithOtp';
import { ProductOptions } from '../../types/products';
import { OrderItems } from '../../types/order';
import SimpleActionButton from '../../components/agGridTable/customComponents/SimpleActionButton';

const AddEditOrder = () => {
  const { control, watch, reset, setValue, handleSubmit, clearErrors, getValues } = useFormContext<OrderSchema>();

  const dispatch = useAppDispatch();

  const users = useAppSelector(allUsers);
  const salesPeople = getUserRoleBasedOptions(users, Roles.SalesPerson);

  const measurementMethods = useForm<MeasurementSchema>({
    mode: 'all',
    resolver: zodResolver(measurementSchema),
    defaultValues: defaultMeasurementValues,
  });

  const initialProductOptions = (productCategoryItemMap.find((cat) => cat.category === ProductCategory.FullSuit)?.items || []).map((item) => ({
    id: item,
    label: capitalize(item),
    checked: false,
  }));

  const [selectedCategory, setSelectedCategory] = useState<any>(ProductCategory.FullSuit);
  const [productOptions, setProductOptions] = useState<ProductOptions[]>(initialProductOptions);
  const [selectedItems, setSelectedItems] = useState<OrderItems[]>([]);
  const [disableCheckboxes, setDisableCheckboxes] = useState(false);
  const [openMeasurement, setOpenMeasurement] = useState(false);
  const [rentSelect, setOpenRentSelect] = useState(false);
  const [description, setDescription] = useState('');
  const [itemTotal, setItemTotal] = useState(0);
  //   const [productOptions, setProductOptions] = useState<OptionCheckBox[]>(initialProductOptions);

  const total = useWatch({ control, name: 'totalPrice' });
  const advance = useWatch({ control, name: 'advPayment' });
  const discount = useWatch({ control, name: 'discount' });
  const variant = useWatch({ control, name: 'variant' });

  const { salesOrderId } = useParams();

  const isAddItemButtonDisabled = !productOptions.some((option) => option.checked);

  const [trigger, { data: customer, isLoading: isCustomerSearching }] = useLazySearchCustomerQuery();
  const [updateSalesOrder, { data, isLoading: isOrderUpdating }] = useUpdateSalesOrderMutation();
  const [getSalesOrderData, { data: salesOrderData, isLoading: isSalesOrderLoading }] = useLazyGetSingleSalesOrderQuery();
  const [addProduct, { data: addProductData, isLoading: isAddingProduct }] = useAddNewProductMutation();
  const [addOrder, { data: newOrder, isLoading: salesOrderLoading }] = useAddNewOrderMutation();

  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  useEffect(() => {
    dispatch(setLoading(isOrderUpdating));
  }, [isOrderUpdating]);
  useEffect(() => {
    dispatch(setLoading(isSalesOrderLoading));
  }, [isSalesOrderLoading]);
  useEffect(() => {
    dispatch(setLoading(isAddingProduct));
  }, [isAddingProduct]);
  useEffect(() => {
    dispatch(setLoading(isCustomerSearching));
  }, [isCustomerSearching]);

  // Handle category selection
  const handleCategoryChange = (event: any) => {
    const category = event.target.value as string;
    setSelectedCategory(category);
    const categoryItems = productCategoryItemMap.find((cat) => cat.category === category)?.items || [];
    setProductOptions(
      categoryItems.map((item) => ({
        id: item,
        label: capitalize(item),
        checked: false,
      }))
    );
    if (category === ProductCategory.General) {
      setDisableCheckboxes(false);
    }
  };

  // Handle checkbox change
  const handleCheckBoxChange = (id) => {
    setProductOptions((prevOptions) => {
      // Toggle the checked state of the clicked checkbox
      const updatedOptions = prevOptions.map((option) => (option.id === id ? { ...option, checked: !option.checked } : option));

      // For the 'General' category, check if any checkbox is checked
      if (selectedCategory === 'General') {
        const isAnyChecked = updatedOptions.some((option) => option.checked); // true if one checkbox is checked

        // Enable or disable checkboxes based on the current checked state
        setDisableCheckboxes(isAnyChecked);
      }

      return updatedOptions;
    });
  };

  // Handle input change (price input)
  const handleInputChange = (id, price) => {
    setProductOptions((prevOptions) => prevOptions.map((option) => (option.id === id ? { ...option, price } : option)));
  };

  // Handle Add Items button click
  const handleAddItems = async () => {
    const selectedProducts = productOptions
      .filter((option) => option.checked) // Only include checked items selected.
      .map((option) => ({
        productType: option.id,
      }));

    if (selectedProducts.length > 0 && selectedCategory) {
      const productDetails = await Promise.all(
        selectedProducts.map(async (product) => {
          const response = await addProduct({
            itemType: product.productType,
            itemCategory: selectedCategory,
          }).unwrap(); // Get the API response and unwrap if necessary
          return { productId: response.productId as number, productType: response.productType }; // Assuming productId is returned from the API
        })
      );

      const newItem = {
        category: selectedCategory,
        description,
        products: productDetails,
        amount: itemTotal,
        isMeasurementSet: false,
      };
      setSelectedItems([...selectedItems, newItem]);
      clearErrors();
      clearOrderItems();
    }
  };
  const handleKeyPress = (e: { key: string; preventDefault: () => void }) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the form submission
      handleSearchCustomer();
    }
  };
  const handleKeyPressOnPrice = (e: { key: string; preventDefault: () => void }) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the form submission
      handleAddItems();
    }
  };

  const handleMeasurementClose = useCallback(() => setOpenMeasurement(false), []);
  const handleRentClose = useCallback(() => setOpenRentSelect(false), []);

  const handleOpenMeasurement = useCallback((productId: number, isRent: boolean) => {
    if (isRent) {
      setOpenRentSelect(true);
    } else {
      setOpenMeasurement(true);
    }

    dispatch(setSelectedProduct(productId));
  }, []);

  const handleRemove = (rowIndex: number) => {
    // Filter out the products that do not match the given productId
    const updatedItems = selectedItems.filter((item: any, index: number) => index !== rowIndex); // Remove items with no products

    // Update the state with the filtered items
    setSelectedItems(updatedItems);
  };

  const transformOrderDetails = (orderDetails: any, isRowData?: boolean) => {
    return orderDetails.map((detail: any) => {
      return {
        category: detail.category,
        description: detail.description,
        products: detail.products.map((product: any) => {
          if (isRowData) {
            return { productId: product.productId, productType: product.itemType };
          }
          return product.productId;
        }),
        amount: detail.amount,
      };
    });
  };

  const getUpdatingFormattedData = (data: any) => {
    const salesPerson = data.salesPerson.userId;
    const weddingDate = data?.weddingDate ? new Date(data.weddingDate) : null;
    const orderDate = data?.orderDate ? new Date(data.orderDate) : null;
    const deliveryDate = data?.deliveryDate ? new Date(data.deliveryDate) : null;
    const fitOnRounds = data?.fitOnRounds.map((round: any) => (round ? new Date(round) : null));
    const orderDetails = transformOrderDetails(data?.orderDetails);
    setSelectedItems(orderDetails);
    return { ...data, salesPerson, weddingDate, orderDate, deliveryDate, fitOnRounds, orderDetails };
  };

  const colDefs = [
    {
      headerName: 'Product Details',
      field: 'product',
      cellRenderer: ProductRenderer,
      cellRendererParams: (params: any) => ({
        data: { ...params.data, selectedCategory },
        handleOpenMeasurement,
        handleRemove,
      }),
      autoHeight: true,
      minWidth: 300,
    },
    { headerName: 'Amount', field: 'amount' },
    {
      headerName: '',
      cellRenderer: SimpleActionButton,
      cellRendererParams: (params: ICellRendererParams) => ({
        handleRemove,
        idField: 'rowIndex',
        rowIndex: params.node.rowIndex,
      }),
    },
  ];

  const handleSearchCustomer = () => {
    trigger(customerSearchQuery);
  };

  const clearOrderItems = () => {
    setProductOptions(initialProductOptions);
    setItemTotal(0);
    setDescription('');
  };

  const handleCancelOrder = () => {
    reset();
  };

  const handleOrderFormReset = () => {
    reset(defaultOrderValues);
    setSelectedItems([]);
    setCustomerSearchQuery('');
  };

  useEffect(() => {
    dispatch(setLoading(salesOrderLoading));
  }, [salesOrderLoading]);

  const handleValidateData = () => {
    const formData = getValues();

    const result = orderSchema.safeParse(formData);

    console.log(result);
  };

  useEffect(() => {
    if (salesOrderId) {
      // Fetch and populate the order data for editing
      getSalesOrderData(salesOrderId).then((response) => {
        if (response.data) {
          reset(getUpdatingFormattedData(response.data)); // Populate the form with fetched data
          dispatch(setSelectedCustomerId(response.data.customer.customerId));
          const formattedOrderDetails = transformOrderDetails(response.data.orderDetails, true);
          setSelectedItems(formattedOrderDetails);
        }
      });
    } else {
      handleOrderFormReset();
    }
  }, [salesOrderId, salesOrderData]);

  useEffect(() => {
    if (selectedItems) {
      const totalAmount = selectedItems.reduce((sum: number, row: OrderItems) => sum + (row.amount || 0), 0);
      setValue('totalPrice', totalAmount);

      const updatedItems = selectedItems.map((item) => ({
        ...item,
        products: item.products.map((product) => product.productId),
      }));

      setValue('orderDetails', updatedItems);
    }
  }, [selectedItems]);

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
      setValue('customer.name', customer.name, { shouldDirty: true, shouldValidate: true });
      setValue('customer.mobile', customer.mobile, { shouldDirty: true, shouldValidate: true });
      setValue('customer.secondaryMobile', customer.secondaryMobile ?? '', { shouldDirty: true, shouldValidate: true });
      setValue('customer.otherMobile', customer.otherMobile ?? '', { shouldDirty: true, shouldValidate: true });
      dispatch(setSelectedCustomerId(customer.customerId));
      clearErrors();
    }
  }, [customer, customerSearchQuery, setValue, dispatch, clearErrors]);

  const onSubmit: SubmitHandler<OrderSchema> = async (data) => {
    try {
      const newWindow = window.open('', '_blank');
      if (variant === 'edit') {
        const response = await updateSalesOrder(data);
        if (response.error) {
          console.log(response.error);
        } else {
          const baseUrl = import.meta.env.VITE_BASE_URL;
          const invoiceUrl = `${baseUrl}/api/v1/invoice/salesOrder/${salesOrderId}`;
          toast.success('Order Updated!');
          dispatch(removeSelectedCustomerId());
          reset();
          if (newWindow) {
            newWindow.location.href = invoiceUrl;
          }
        }
      } else {
        const response = await addOrder(data);
        if (response.error) {
          console.log(response.error);
        } else {
          const orderId = response.data.salesOrderId;
          const baseUrl = import.meta.env.VITE_BASE_URL;
          const invoiceUrl = `${baseUrl}/api/v1/invoice/salesOrder/${orderId}`;
          toast.success('New order Added!');
          handleOrderFormReset();
          if (newWindow) {
            newWindow.location.href = invoiceUrl;
          }
        }
      }
    } catch (e) {
      toast.error(`Material Action Failed. ${e.message}`);
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
                    <div className="col-6 d-flex gap-2 mb-3 align-items-end">
                      <TextField
                        label="Search Customer"
                        size="small"
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
                      <RHFDropDown<OrderSchema> options={stores} name="store" label="Store" />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <RHFTextField<OrderSchema> label="Name" name="customer.name" />
                    </div>
                    <CustomMobileWithOtp<OrderSchema> label="Mobile" name="customer.mobile" />
                    <CustomMobileWithOtp<OrderSchema> label="Secondary Mobile" name="customer.secondaryMobile" />
                    <CustomMobileWithOtp<OrderSchema> label="Other Mobile" name="customer.otherMobile" />
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
                      <RHFDropDown<OrderSchema> options={paymentOptions} name="paymentType" label="Payment Type" />
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
                    <button className="primary-button" type="submit">
                      {variant === 'create' ? 'Create Order ' : 'Edit Order '}
                    </button>
                    {/* <button className="primary-button" type="button" onClick={() => handleValidateData()}>
                      validate
                    </button> */}
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
            <div className="card add-order-card">
              <div className="card-header">
                <h5>Add order Items</h5>
              </div>
              <div className="card-body d-flex flex-column">
                <div className="row">
                  <div className="col-12 mb-3">
                    <TextField label="Description" value={description} onChange={(e) => setDescription(e?.target?.value)} />
                  </div>
                  <div className="col-12 d-flex gap-3 align-items-end">
                    <div className="col-5 mb-3">
                      <FormControl sx={{ m: 1, maxWidth: 165 }} size="small">
                        <Select value={selectedCategory} onChange={handleCategoryChange}>
                          {productCategoryItemMap.map((option) => (
                            <MenuItem key={option.category} value={option.category}>
                              {option.category}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="col-5 mb-3">
                      <TextField
                        label="Price"
                        value={itemTotal}
                        type="number"
                        onChange={(e) => setItemTotal(Number(e?.target?.value))}
                        onKeyDown={handleKeyPressOnPrice}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-grow-1 overflow-auto">
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Select Products</FormLabel>
                    <FormGroup>
                      {productOptions?.length &&
                        productOptions.map((option) => (
                          <CheckBoxWithInput
                            key={option.id}
                            option={option}
                            handleCheckBoxChange={handleCheckBoxChange}
                            handleInputChange={handleInputChange}
                            disableCheckboxes={disableCheckboxes && selectedCategory === 'General'}
                          />
                        ))}
                    </FormGroup>
                  </FormControl>
                </div>
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
            <Table<any> rowData={selectedItems} colDefs={colDefs} defaultColDef={{ resizable: true }} pagination={false} />
          </div>
        </div>
      </div>
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
      <Modal open={rentSelect} onClose={handleRentClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div>
          <SelectRentItem handleClose={handleRentClose} />
        </div>
      </Modal>
    </div>
  );
};

export default AddEditOrder;
