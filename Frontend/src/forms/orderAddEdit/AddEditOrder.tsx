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
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';
import { defaultOrderValues, OrderSchema } from '../formSchemas/orderSchema';
import {
  useAddNewOrderMutation,
  useLazyGetSingleSalesOrderQuery,
  useLazySearchCustomerQuery,
  useUpdateSalesOrderMutation,
} from '../../redux/features/orders/orderApiSlice';
import RHFDatePicker from '../../components/customFormComponents/customDatePicker/RHFDatePricker';
import RHFDropDown from '../../components/customFormComponents/customDropDown/RHFDropDown';
import AddEditProduct from '../productAddEdit/AddEditProduct';
import { ProductSchema, defaultProductValues, productSchema } from '../formSchemas/productSchema';
import Table from '../../components/agGridTable/Table';
import { MeasurementSchema, defaultMeasurementValues, measurementSchema } from '../formSchemas/measurementSchema';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks/reduxHooks';
import { setSelectedProduct } from '../../redux/features/product/productSlice';
import { removeOrderProducts, selectOrderItems, setOrderProductsBulk } from '../../redux/features/orders/orderSlice';
import { useAddNewProductMutation, useGetAllProductsQuery } from '../../redux/features/product/productApiSlice';
import mapProducts from '../../utils/productUtils';
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

const AddEditOrder = () => {
  const { control, watch, reset, setValue, handleSubmit, clearErrors, getValues } = useFormContext<OrderSchema>();

  const dispatch = useAppDispatch();

  const users = useAppSelector(allUsers);
  const salesPeople = getUserRoleBasedOptions(users, Roles.SalesPerson);

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

  const initialProductOptions = (productCategoryItemMap.find((cat) => cat.category === ProductCategory.General)?.items || []).map((item) => ({
    id: item,
    label: capitalize(item),
    checked: false,
    price: '', // Default price to empty
  }));

  const [selectedCategory, setSelectedCategory] = useState<any>(ProductCategory.General);
  const [productOptions, setProductOptions] = useState<any>(initialProductOptions);
  const [selectedItems, setSelectedItems] = useState([]);
  const [disableCheckboxes, setDisableCheckboxes] = useState(false);

  const [openProducts, setOpenProducts] = useState(false);
  const [openMeasurement, setOpenMeasurement] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [description, setDescription] = useState('');
  //   const [productOptions, setProductOptions] = useState<OptionCheckBox[]>(initialProductOptions);

  const total = useWatch({ control, name: 'totalPrice' });
  const advance = useWatch({ control, name: 'advPayment' });
  const discount = useWatch({ control, name: 'discount' });
  const variant = useWatch({ control, name: 'variant' });

  const { salesOrderId } = useParams();

  const orderItems = useAppSelector(selectOrderItems);
  const isAddItemButtonDisabled = description.trim() === '' || !productOptions.some((option) => option.checked);

  const [trigger, { data: customer, isLoading }] = useLazySearchCustomerQuery();
  const [updateSalesOrder] = useUpdateSalesOrderMutation();
  const [getSalesOrderData, { data: salesOrderData }] = useLazyGetSingleSalesOrderQuery();
  const { data: productsData, isLoading: productsLoading } = useGetAllProductsQuery({});
  const [addProduct] = useAddNewProductMutation();

  const [addOrder, { data: newOrder }] = useAddNewOrderMutation();

  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

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
        price: '', // Default price to empty
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
      .filter((option) => option.checked && option.price) // Only include checked items with a price
      .map((option) => ({
        productType: option.id,
        price: option.price,
      }));

    if (selectedProducts.length > 0 && selectedCategory) {
      const productIds = await Promise.all(
        selectedProducts.map(async (product) => {
          const response = await addProduct({
            itemType: product.productType,
            itemCategory: selectedCategory,
            price: product.price,
          }).unwrap(); // Get the API response and unwrap if necessary
          return response; // Assuming productId is returned from the API
        })
      );

      const newItem = {
        category: selectedCategory,
        description,
        products: productIds,
      };
      setSelectedItems([...selectedItems, newItem]);
      clearOrderItems();
    }
  };

  const handleClose = useCallback(() => setOpenProducts(false), []);
  const handleMeasurementClose = useCallback(() => setOpenMeasurement(false), []);

  const handleOpenMeasurement = useCallback((productId: number) => {
    setOpenMeasurement(true);
    dispatch(setSelectedProduct(productId));
  }, []);

  const handleRemove = (id: number) => {
    dispatch(removeOrderProducts(id));
  };

  const transformOrderDetails = (orderDetails: any) => {
    return orderDetails.map((detail: any) => {
      return {
        description: detail.description,
        products: detail.products.map((product: any) => product.productId),
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
    return { ...data, salesPerson, weddingDate, orderDate, deliveryDate, fitOnRounds, orderDetails };
  };

  const colDefs = [
    {
      headerName: 'Product Details',
      field: 'product',
      cellRenderer: ProductRenderer,
      cellRendererParams: (params: any) => ({
        data: params.data,
        handleOpenMeasurement,
        handleRemove,
      }),
      autoHeight: true,
    },
    { headerName: 'Amount', field: 'amount' },
  ];

  const handleSearchCustomer = () => {
    trigger(customerSearchQuery);
  };

  //   const handleCheckBoxSelect = (id: string) => {
  //     setProductOptions((prevOptions) => {
  //       const newOptions = prevOptions.map((option) => {
  //         if (option.id === id) {
  //           if (!option.checked) {
  //             // Only set open to true if the checkbox is being checked
  //             setOpenProducts(true);
  //           }
  //           return { ...option, checked: !option.checked };
  //         }
  //         return option;
  //       });
  //       return newOptions;
  //     });
  //     dispatch(setProductType(id));
  //   };

  //   const handleAddItems = () => {
  //     dispatch(setOrderProducts(description));
  //     setProductOptions(initialProductOptions);
  //     setDescription('');
  //   };

  const clearOrderItems = () => {
    setProductOptions([]);
    setDescription('');
  };

  const handleCancelOrder = () => {
    reset();
  };

  const handleOrderFormReset = () => {
    reset(defaultOrderValues);
    setSelectedItems([]);
    // dispatch(resetOderProducts());
  };

  useEffect(() => {
    if (salesOrderId) {
      // Fetch and populate the order data for editing
      getSalesOrderData(salesOrderId).then((response) => {
        if (response.data) {
          reset(getUpdatingFormattedData(response.data)); // Populate the form with fetched data
          const formattedOrderDetails = transformOrderDetails(response.data.orderDetails);
          dispatch(setOrderProductsBulk(formattedOrderDetails));
        }
      });
    } else {
      handleOrderFormReset();
    }
  }, [salesOrderId, salesOrderData]);

  useEffect(() => {
    if (productsData) {
      const newRowData = mapProducts(selectedItems, productsData);
      setRowData(newRowData);
      console.log(newRowData);
      const totalAmount = newRowData.reduce((sum: number, row: any) => sum + (row.amount || 0), 0);
      setValue('totalPrice', totalAmount);
    }
    if (selectedItems) {
      setValue('orderDetails', selectedItems);
    }
  }, [productsData, selectedItems]);

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
    if (customer) {
      setValue('customer.name', customer.name);
      setValue('customer.mobile', customer.mobile);
      setCustomerSearchQuery('');
      clearErrors();
    }
  }, [customer]);

  const onSubmit: SubmitHandler<OrderSchema> = async (data) => {
    try {
      if (variant === 'edit') {
        const response = await updateSalesOrder(data);
        if (response.error) {
          console.log(response.error);
        } else {
          toast.success('Order Updated!');
          reset();
        }
      } else {
        const response = await addOrder(data);
        if (response.error) {
          console.log(response.error);
        } else {
          const newOrderId = response.data.salesOrderId;
          toast.success('New order Added!');
          handleOrderFormReset();
          //   window.open(`http://localhost:8000/api/v1/invoice/${newOrderId}`, '_blank');
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
                  <div className="col-6 mb-3">
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
            <Table<any> rowData={rowData} colDefs={colDefs} pagination={false} />
          </div>
        </div>
      </div>
      <Modal open={openProducts} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
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
