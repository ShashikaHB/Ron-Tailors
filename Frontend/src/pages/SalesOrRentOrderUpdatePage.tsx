/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { useEffect, useState } from 'react';
import { ColDef } from 'ag-grid-community';
import { FormControl, MenuItem, Select, TextField } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'sonner';
import { useLazyGetSalesOrRentOrderForPaymentQuery, useUpdateSalesOrRentPaymentMutation } from '../redux/features/orders/orderApiSlice';
import MemoizedTable from '../components/agGridTable/Table';
import paymentOptions from '../consts/paymentOptions';

const SalesOrRentOrderUpdatePage = () => {
  const [triggerSearch, { data: orderData }] = useLazyGetSalesOrRentOrderForPaymentQuery();
  const [updateSalesOrRent] = useUpdateSalesOrRentPaymentMutation();
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [payment, setPayment] = useState('0');
  const [paymentType, setPaymentType] = useState('0');
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    if (orderData?.transactions?.length > 0) {
      setRowData(orderData?.transactions);
    }
  }, [orderData]);

  const defaultColDef: ColDef = { resizable: true };

  const colDefs = [
    {
      headerName: 'Date',
      field: 'date',
    },
    { headerName: 'Payment Type', field: 'paymentType' },
    { headerName: 'Amount', field: 'amount' },
  ];

  const handleSearchCustomer = () => {
    triggerSearch(customerSearchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the form submission
      handleSearchCustomer();
    }
  };

  const handlePayNow = async () => {
    const response = await updateSalesOrRent({ orderId: customerSearchQuery, orderData: { paymentType, paymentAmount: payment } });

    if (response) {
      toast.success('Payment SuccessFull');
    }
  };

  return (
    <div className="h-100 d-flex flex-column">
      <div>
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
        </div>
      </div>
      <div className="col-12 d-flex gap-3 flex-column flex-grow-1">
        <div className="card">
          <div className="card-header">
            <h5>Product Details</h5>
          </div>
          <div className="card-body">
            <p>Customer:&nbsp;{orderData?.order?.customer?.name}</p>
            <p>Mobile:&nbsp;{orderData?.order?.customer?.mobile}</p>
            <p>Total:&nbsp;{orderData?.order?.totalPrice}</p>
            <p>Advance:&nbsp;{orderData?.order?.advPayment}</p>
            <p>Balance:&nbsp;{orderData?.order?.balance}</p>
            <div className="row align-items-end">
              {orderData?.order?.balance !== 0 && (
                <>
                  <div className="col-4">
                    <FormControl sx={{ m: 1, maxWidth: 165 }} size="small">
                      <Select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                        {paymentOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value} disabled={!option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="col-4">
                    <TextField
                      label="Pay Now"
                      size="small"
                      placeholder="Search the customer by mobile or name"
                      value={payment}
                      onChange={(e) => setPayment(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />
                  </div>
                  <div className="col-4">
                    <button className="primary-button" type="button" onClick={handlePayNow}>
                      Pay Now
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex-grow-1 overflow-hidden justify-content-center">
          <MemoizedTable rowData={rowData} colDefs={colDefs} defaultColDef={defaultColDef} />
        </div>
      </div>
    </div>
  );
};

export default SalesOrRentOrderUpdatePage;
