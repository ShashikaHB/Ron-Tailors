import React, { useCallback, useEffect, useState } from "react";
import RHFTextField from "../../components/customFormComponents/customTextField/RHFTextField";
import { OrderSchema } from "../formSchemas/orderSchema";
import { Modal, TextField } from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { useLazySearchCustomerQuery } from "../../redux/features/orders/orderApiSlice";
import { toast } from "sonner";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { ApiResonseError } from "../../types/common";
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
import RHFCheckBox from "../../components/customFormComponents/customCheckBoxGroup/RHFCheckBoxGroup";
import CheckBoxGroup from "../../components/customFormComponents/checkboxGroup/CheckBoxGroup";
import Table from "../../components/agGridTable/Table";

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

  const methods = useForm<ProductSchema>({
    mode: "all",
    resolver: zodResolver(productSchema),
    defaultValues: defaultProductValues,
  });

  const [open, setOpen] = useState(false);
  const handleClose = useCallback(() => setOpen(false), []);

  const [trigger, { data: customer, error: customerSearchError, isLoading }] =
    useLazySearchCustomerQuery();
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");

  const handleSearchCustomer = () => {
    trigger(customerSearchQuery);
  };
  const variant = useWatch({ control, name: "variant" });

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
      clearErrors();
    }
  }, [customerSearchError, customer]);

  const salesPeople = [
    {
      value: 112,
      label: "shashika",
    },
    {
      value: 114,
      label: "Nimal",
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

  const rowData = [
    { product: "Coat", qty: 1, amount: 1000 },
    { product: "Coat", qty: 1, amount: 1000 },
    { product: "Coat", qty: 1, amount: 1000 },
  ];

  const colDefs = [
    { headerName: "Product", field: "product" },
    { headerName: "Quantity", field: "qty" },
    { headerName: "Amount", field: "amount" },
  ];

  return (
    <div className="row">
      <div className="col-12 mb-3">
        <form>
          <div className="row">
            <div className="col-6">
              <div className="card">
                <div className="card-header">
                  <h5>Customer info</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 d-flex gap-2 mb-2">
                      <TextField
                        label="Search Customer"
                        placeholder="Search the customer by mobile or name"
                        value={customerSearchQuery}
                        onChange={(e) => setCustomerSearchQuery(e.target.value)}
                      />
                      <button onClick={() => handleSearchCustomer()}>
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
                      <RHFDatePicker<OrderSchema> name="orderDate"></RHFDatePicker>
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDatePicker<OrderSchema> name="deliveryDate"></RHFDatePicker>
                    </div>
                    <div className="col-6 mb-3">
                      <RHFDatePicker<OrderSchema> name="weddingDate"></RHFDatePicker>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card">
                <div className="card-header">
                  <h5>billing</h5>
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
                      onClick={() => console.log("btn clicked")}
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
              <div className="card-header"><h5>Add order Items</h5></div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 mb-3">
                    <TextField label="Description"></TextField>
                  </div>
                </div>
                <CheckBoxGroup></CheckBoxGroup>
                <div className="d-flex justify-content-end">
                  <button
                    className="primary-button"
                    type="submit"
                    onClick={() => console.log("btn clicked")}
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
                <Table rowData={rowData} colDefs={colDefs}></Table>
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
    </div>
  );
};

export default AddEditOrder;
