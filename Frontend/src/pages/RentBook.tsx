/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { ColDef } from 'ag-grid-community';
import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import MemoizedTable from '../components/agGridTable/Table';
import { useGetAllRentOrdersQuery } from '../redux/features/rentOrder/rentOrderApiSlice';
import RentOrderDetailsRenderer from '../components/agGridTable/customComponents/RentOrderDetailsRenderer';
import CustomerRenderer from '../components/agGridTable/customComponents/CustomerRenderer';
import ActionButtonNew from '../components/agGridTable/customComponents/ActionButtonNew';

const RentBook = () => {
  const { data: rentOrders, isError: rentOrderError, isLoading } = useGetAllRentOrdersQuery();

  const navigate = useNavigate();

  const defaultColDef: ColDef = { resizable: true };

  const handleOpen = (id: string) => {
    navigate(`/secured/addRentOrder/${id}`);
  };

  const initialColDefs: ColDef<any>[] = [
    { headerName: 'Id', field: 'rentOrderId', minWidth: 100 },
    { headerName: 'Customer', field: 'customer', cellRenderer: CustomerRenderer, autoHeight: true, minWidth: 200 },
    { headerName: 'Order Details', field: 'rentOrderDetails', cellRenderer: RentOrderDetailsRenderer, autoHeight: true, minWidth: 300 },
    { headerName: 'Rent Date', field: 'rentDate', valueFormatter: (params) => format(params.value as Date, 'dd-MM-yyyy'), minWidth: 100 },
    { headerName: 'Return Date', field: 'returnDate', valueFormatter: (params) => format(params.value as Date, 'dd-MM-yyyy'), minWidth: 100 },
    { headerName: 'Order Status', field: 'orderStatus' },
    {
      headerName: 'Actions',
      field: 'action',
      cellRenderer: ActionButtonNew,
      cellRendererParams: {
        handleEdit: handleOpen,
        idType: 'rentOrderId',
        isOrderBook: true,
      },
    },
  ];
  const [rowData, setRowData] = useState<any>([]);
  const [colDefs, setColDefs] = useState<any>(initialColDefs);

  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  useEffect(() => {
    if (rentOrders) {
      const transformedRentOrders = rentOrders.map((item) => ({ ...item, action: 'action' }));
      setRowData(transformedRentOrders);
    }
    if (rentOrderError) {
      toast.error('Error when fetching Rent Orders');
    }
  }, [rentOrders, rentOrderError]);

  useEffect(() => {
    if (orderSearchQuery !== '') {
      const lowercasedFilter = orderSearchQuery.toLowerCase();
      const filteredRowData = rentOrders?.filter(
        (item) =>
          item.rentOrderId.toString().toLowerCase().includes(lowercasedFilter) ||
          item.customer.name.toLowerCase().includes(lowercasedFilter) ||
          item.customer.mobile.toLowerCase().includes(lowercasedFilter)
      );
      setRowData(filteredRowData);
    } else {
      setRowData(rentOrders);
    }
  }, [orderSearchQuery]);

  const handleNavigateToRentOrder = (rentOrderId?: number) => {
    navigate('/secured/addRentOrder');
  };

  return (
    <div className="h-100 d-flex flex-column gap-3">
      <div className="d-flex justify-content-between align-items-end">
        <div className="w-50 d-flex">
          <TextField
            label="Search Order"
            placeholder="Search by Barcode or contact or orderId"
            value={orderSearchQuery}
            onChange={(e) => setOrderSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <button type="button" className="primary-button" onClick={() => handleNavigateToRentOrder()}>
            Add new Rent Order
          </button>
        </div>
      </div>
      <div className="flex-grow-1 overflow-hidden">
        <MemoizedTable rowData={rowData} colDefs={colDefs} defaultColDef={defaultColDef} />
      </div>
    </div>
  );
};

export default RentBook;
