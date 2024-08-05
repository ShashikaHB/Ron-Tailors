/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { ColDef } from 'ag-grid-community';
import { CustomCellRendererProps } from 'ag-grid-react';
import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import ActionButtons from '../components/agGridTable/customComponents/ActionButtons';
import MemoizedTable from '../components/agGridTable/Table';
import CustomerRenderer from '../components/agGridTable/customComponents/CustomerRenderer';
import { useGetAllSalesOrdersQuery } from '../redux/features/orders/orderApiSlice';
import SalesOrderDetailsRenderer from '../components/agGridTable/customComponents/SalesOrderDetailsRenderer';

const SalesOrderBook = () => {
  const { data: salesOrders, isError: salesOrderError, isLoading } = useGetAllSalesOrdersQuery();

  const nagivate = useNavigate();

  const defaultColDef: ColDef = { resizable: true };

  const handleOpen = () => {
    console.log('clicked open');
  };

  const initialColDefs: ColDef<any>[] = [
    { headerName: 'Order Id', field: 'orderId' },
    { headerName: 'Customer', field: 'customer', cellRenderer: CustomerRenderer, autoHeight: true },
    { headerName: 'Order Details', field: 'orderDetails', cellRenderer: SalesOrderDetailsRenderer, autoHeight: true, minWidth: 400 },
    { headerName: 'Order Date', field: 'orderDate', valueFormatter: (params) => format(params.value as Date, 'dd-MM-yyyy') },
    { headerName: 'Delivery Date', field: 'deliveryDate', valueFormatter: (params) => format(params.value as Date, 'dd-MM-yyyy') },
    {
      headerName: 'Actions',
      field: 'action',
      cellRenderer: ActionButtons,
      cellRendererParams: (params: CustomCellRendererProps) => ({
        materialId: params.data?.orderId,
        handleOpen,
      }),
    },
  ];
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDefs, setColDefs] = useState<ColDef<any>[]>(initialColDefs);

  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  const handleNavigateToRentOrder = (rentOrderId?: number) => {
    nagivate('/secured/addSalesOrder');
  };

  useEffect(() => {
    if (salesOrders) {
      const transformedRentOrders = salesOrders.map((item: any) => ({ ...item, action: 'action' }));
      setRowData(transformedRentOrders);
    }
    if (salesOrderError) {
      toast.error('Error when fetching Rent Orders');
    }
  }, [salesOrders, salesOrderError]);

  useEffect(() => {
    if (orderSearchQuery !== '') {
      const lowercasedFilter = orderSearchQuery.toLowerCase();
      const filteredRowData = salesOrders.filter(
        (item: any) =>
          item.orderId.toString().toLowerCase().includes(lowercasedFilter) ||
          item.customer.name.toLowerCase().includes(lowercasedFilter) ||
          item.customer.mobile.toLowerCase().includes(lowercasedFilter)
      );
      setRowData(filteredRowData);
    } else {
      setRowData(salesOrders);
    }
  }, [orderSearchQuery]);

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
            Add new Sales Order
          </button>
        </div>
      </div>
      <div className="flex-grow-1 overflow-hidden">
        <MemoizedTable rowData={rowData} colDefs={colDefs} defaultColDef={defaultColDef} />
      </div>
    </div>
  );
};

export default SalesOrderBook;
