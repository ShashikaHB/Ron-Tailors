import { TextField } from '@mui/material'
import React from 'react'
import { FaSearch } from 'react-icons/fa'
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField'
import { OrderSchema } from '../formSchemas/orderSchema'
import RHFDropDown from '../../components/customFormComponents/customDropDown/RHFDropDown'
import RHFDatePicker from '../../components/customFormComponents/customDatePicker/RHFDatePricker'
import Table from "../../components/agGridTable/Table";
import { PaymentType } from '../../enums/PaymentType'

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

const NewRentOut = () => {
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
                    <div className="col-12 d-flex gap-2 mb-3">
                      <TextField
                        label="Search Customer"
                        placeholder="Search the customer by mobile or name"
                        // value={customerSearchQuery}
                        // onChange={(e) => setCustomerSearchQuery(e.target.value)}
                      />
                      <button
                        type="button"
                        // onClick={() => handleSearchCustomer()}
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
                    //   onClick={handleCancelOrder}
                    >
                      Cancel Order
                    </button>
                    <button
                      className="primary-button"
                      type="submit"
                      onClick={() => console.log("btn clicked")}
                    >
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
                <h5>Add order Items</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 mb-3">
                    <TextField
                      label="Description"
                    //   value={description}
                    //   onChange={(e) => setDescription(e?.target?.value)}
                    ></TextField>
                  </div>
                </div>
                {/* <CheckBoxGroup
                  options={productOptions}
                  handleCheckBoxSelect={handleCheckBoxSelect}
                ></CheckBoxGroup> */}
                <div className="d-flex justify-content-end">
                  <button
                    className="secondary-button mx-2"
                    type="button"
                    // disabled={isAddItemButtonDisabled}
                    // onClick={clearOrderItems}
                  >
                    Clear Items
                  </button>
                  <button
                    className="primary-button"
                    type="button"
                    // disabled={isAddItemButtonDisabled}
                    // onClick={() => handleAddItems()}
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
                {/* <Table
                  rowData={rowData}
                  colDefs={colDefs}
                  pagination={false}
                ></Table> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <button onClick={() => setOpen(true)}>Add products to Order</button> */}
    </div>
  )
}

export default NewRentOut