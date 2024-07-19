import { useCallback, useEffect, useState } from "react";
import RHFTextField from "../../components/customFormComponents/customTextField/RHFTextField";
import { OrderSchema } from "../formSchemas/orderSchema";
import { Modal, TextField } from "@mui/material";
import { FaSearch } from "react-icons/fa";
import {
  useAddNewOrderMutation,
  useLazySearchCustomerQuery,
} from "../../redux/features/orders/orderApiSlice";
import { toast } from "sonner";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { ApiResonseError, OptionCheckBox } from "../../types/common";
import RHFDatePicker from "../../components/customFormComponents/customDatePicker/RHFDatePricker";
import RHFDropDown from "../../components/customFormComponents/customDropDown/RHFDropDown";
import { PaymentType } from "../../enums/PaymentType";
import AddEditProduct from "../productAddEdit/AddEditProduct";
import { DevTool } from "@hookform/devtools";
import {
  ProductSchema,
  defaultProductValues,
  productSchema,
} from "../formSchemas/productSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import CheckBoxGroup from "../../components/customFormComponents/checkboxGroup/CheckBoxGroup";
import Table from "../../components/agGridTable/Table";
import { ProductType } from "../../enums/ProductType";
import {
  MeasurementSchema,
  defaultMeasurementValues,
  measurementSchema,
} from "../formSchemas/measurementSchema";
import {
  useAppDispatch,
  useAppSelector,
} from "../../redux/reduxHooks/reduxHooks";
import {
  setProductType,
  setSelectedProduct,
} from "../../redux/features/product/productSlice";
import {
  selectOrderItems,
  setOrderProducts,
} from "../../redux/features/orders/orderSlice";
import { useGetAllProductsQuery } from "../../redux/features/product/productApiSlice";
import { mapProducts } from "../../utils/productUtils";
import ActionButtons from "../../components/agGridTable/customComponents/ActionButtons";
import ProductRenderer from "../../components/agGridTable/customComponents/ProductRenderer";
import AddEditMeasurement from "../measurementAddEdit/AddEditMeasurement";
import { any } from "zod";
import { useNavigate } from "react-router-dom";

const salesPeople = [
  {
    value: 0,
    label: "Select a Sales Person",
  },
  {
    value: 112,
    label: "shashika",
  },
  {
    value: 114,
    label: "Nimal",
  },
];

const initialProductOptions = [
  {
    id: ProductType.Shirt,
    label: "Shirt",
    checked: false,
  },
  {
    id: ProductType.Coat,
    label: "Coat",
    checked: false,
  },
  {
    id: ProductType.Trouser,
    label: "Trouser",
    checked: false,
  },
  {
    id: ProductType.WestCoat,
    label: "West Coat",
    checked: false,
  },
  {
    id: ProductType.Cravat,
    label: "Cravat",
    checked: false,
  },
  {
    id: ProductType.Bow,
    label: "Bow",
    checked: false,
  },
  {
    id: ProductType.Tie,
    label: "Tie",
    checked: false,
  },
];

const paymentOptions = [
  {
    value: PaymentType.Cash,
    label: "Cash",
  },
  {
    value: PaymentType.Card,
    label: "Card",
  },
];

// const rowData = [
//   { product: "Coat", qty: 1, amount: 1000 },
//   { product: "Coat", qty: 1, amount: 1000 },
//   { product: "Coat", qty: 1, amount: 1000 },
// ];

const AddEditOrder = () => {
  const {
    control,
    unregister,
    watch,
    reset,
    setValue,
    handleSubmit,
    getValues,
    clearErrors,
  } = useFormContext<OrderSchema>();

  const colDefs = [
    {
      headerName: "Product",
      field: "product",
      cellRenderer: ProductRenderer,
      cellRendererParams: (params) => ({
        data: params.data,
        handleOpenMeasurement: handleOpenMeasurement,
      }),
      autoHeight: true,
    },
    { headerName: "Amount", field: "amount" },
    {
      headerName: "Actions",
      field: "action",
      cellRenderer: ActionButtons,
      cellRendererParams: (params) => ({
        productId: params.data?.productId,
        action: "delete",
      }),
    },
  ];

  const handleOpenMeasurement = useCallback((productId: number) => {
    setOpenMeasurement(true);
    dispatch(setSelectedProduct(productId));
  }, []);

  const orderItems = useAppSelector(selectOrderItems);

  const methods = useForm<ProductSchema>({
    mode: "all",
    resolver: zodResolver(productSchema),
    defaultValues: defaultProductValues,
  });
  const measurementMethods = useForm<MeasurementSchema>({
    mode: "all",
    resolver: zodResolver(measurementSchema),
    defaultValues: defaultMeasurementValues,
  });

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [openMeasurement, setOpenMeasurement] = useState(false);
  const [description, setDescription] = useState("");

  const [productOptions, setProductOptions] = useState<OptionCheckBox[]>(
    initialProductOptions
  );

  const dispatch = useAppDispatch();

  const total = useWatch({ control: control, name: "totalPrice" });
  const advance = useWatch({ control: control, name: "advPayment" });
  const discount = useWatch({ control: control, name: "discount" });

  const handleClose = useCallback(() => setOpen(false), []);

  const handleMeasurementClose = useCallback(
    () => setOpenMeasurement(false),
    []
  );

  const [trigger, { data: customer, error: customerSearchError, isLoading }] =
    useLazySearchCustomerQuery();

  const [addOrder, { data: newOrder }] = useAddNewOrderMutation();

  const [customerSearchQuery, setCustomerSearchQuery] = useState("");

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
  const isAddItemButtonDisabled =
    description.trim() === "" ||
    !productOptions.some((option) => option.checked);

  const variant = useWatch({ control, name: "variant" });

  const handleAddItems = () => {
    dispatch(setOrderProducts(description));
    setProductOptions(initialProductOptions);
    setDescription("");
  };

  const clearOrderItems = () => {
    setProductOptions(initialProductOptions);
    setDescription("");
  };

  const handleCancelOrder = () => {
    reset();
  };

  const {
    data: productsData,
    error,
    isLoading: productsLoading,
  } = useGetAllProductsQuery({});

  useEffect(() => {
    if (productsData) {
      const newRowData = mapProducts(orderItems, productsData);
      setRowData(newRowData);
      const totalAmount = newRowData.reduce(
        (sum, row) => sum + (row.amount || 0),
        0
      );
      setValue("totalPrice", totalAmount);
    }
    if (orderItems) {
      setValue("orderDetails", orderItems);
    }
  }, [productsData, orderItems]);

  useEffect(() => {
    const validDiscount = discount ?? 0;
    const validAdvance = advance ?? 0;
    const subTotal = total - validDiscount;
    const balance = subTotal - validAdvance;
    setValue("subTotal", subTotal);
    setValue("balance", balance);
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
      let errorMessage = "An unknown error occurred";
      if ("status" in customerSearchError) {
        // error is FetchBaseQueryError
        const err = customerSearchError as ApiResonseError;
        errorMessage = err.data.error ?? "Something went wrong";
      } else if (customerSearchError instanceof Error) {
        // error is SerializedError
        errorMessage = customerSearchError.message;
      }
      toast.error(errorMessage);
    }
    if (customer) {
      setValue("customer.name", customer.name);
      setValue("customer.mobile", customer.mobile);
      setCustomerSearchQuery("");
      clearErrors();
    }
  }, [customerSearchError, customer]);

  const onSubmit: SubmitHandler<OrderSchema> = async (data) => {
    try {
      if (variant === "edit") {
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
          toast.success("New order Added.");
          reset();
          window.open(
            `http://localhost:8000/api/v1/invoice/${newOrderId}`,
            "_blank"
          );
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
                      <button
                        type="button"
                        onClick={() => handleSearchCustomer()}
                      >
                        <span>
                          <FaSearch></FaSearch>
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <RHFTextField<OrderSchema>
                        label="Mobile"
                        name="customer.mobile"
                      ></RHFTextField>
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<OrderSchema>
                        label="Name"
                        name="customer.name"
                      ></RHFTextField>
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDropDown<OrderSchema>
                        options={salesPeople}
                        name="salesPerson"
                        label="Sales Person"
                      ></RHFDropDown>
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDatePicker<OrderSchema>
                        name="orderDate"
                        label="Order Date"
                      ></RHFDatePicker>
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDatePicker<OrderSchema>
                        name="deliveryDate"
                        label="Delivery Date"
                      ></RHFDatePicker>
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDatePicker<OrderSchema>
                        name="weddingDate"
                        label="Wedding Date"
                      ></RHFDatePicker>
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
                      <RHFTextField<OrderSchema>
                        label="Total"
                        name="totalPrice"
                        disabled
                      ></RHFTextField>
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDropDown<OrderSchema>
                        options={paymentOptions}
                        name="paymentType"
                      ></RHFDropDown>
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<OrderSchema>
                        label="Advance"
                        name="advPayment"
                      ></RHFTextField>
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<OrderSchema>
                        label="Discount"
                        name="discount"
                      ></RHFTextField>
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<OrderSchema>
                        label="SubTotal"
                        name="subTotal"
                        disabled
                      ></RHFTextField>
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<OrderSchema>
                        label="Balance"
                        name="balance"
                        disabled
                      ></RHFTextField>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="secondary-button"
                      type="submit"
                      onClick={handleCancelOrder}
                    >
                      Cancel Order
                    </button>
                    <button
                      className="primary-button"
                      type="submit"
                      onClick={() => console.log("btn clicked")}
                    >
                      {variant === "create" ? "Create Order " : "Edit Order "}
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
                    <TextField
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e?.target?.value)}
                    ></TextField>
                  </div>
                </div>
                <CheckBoxGroup
                  options={productOptions}
                  handleCheckBoxSelect={handleCheckBoxSelect}
                ></CheckBoxGroup>
                <div className="d-flex justify-content-end">
                  <button
                    className="secondary-button mx-2"
                    type="button"
                    disabled={isAddItemButtonDisabled}
                    onClick={clearOrderItems}
                  >
                    Clear Items
                  </button>
                  <button
                    className="primary-button"
                    type="button"
                    disabled={isAddItemButtonDisabled}
                    onClick={() => handleAddItems()}
                  >
                    Add Items
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card  h-100">
              <div className="card-body">
                <Table
                  rowData={rowData}
                  colDefs={colDefs}
                  pagination={false}
                ></Table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <button onClick={() => setOpen(true)}>Add products to Order</button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <FormProvider {...methods}>
            <div>
              <AddEditProduct handleClose={handleClose}></AddEditProduct>
              <DevTool control={methods.control} />
            </div>
          </FormProvider>
        </div>
      </Modal>
      <Modal
        open={openMeasurement}
        onClose={handleMeasurementClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <FormProvider {...measurementMethods}>
            <div>
              <AddEditMeasurement
                handleClose={handleMeasurementClose}
              ></AddEditMeasurement>
              <DevTool control={measurementMethods.control} />
            </div>
          </FormProvider>
        </div>
      </Modal>
    </div>
  );
};

export default AddEditOrder;
