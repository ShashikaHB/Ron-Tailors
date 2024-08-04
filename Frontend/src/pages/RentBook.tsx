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
import { RentOrderTableSchema } from '../types/rentOrder';
import ActionButtons from '../components/agGridTable/customComponents/ActionButtons';
import { RentItemTableSchema } from '../types/rentItem';
import MemoizedTable from '../components/agGridTable/Table';
import { useGetAllRentOrdersQuery } from '../redux/features/rentOrder/rentOrderApiSlice';
import RentOrderDetailsRenderer from '../components/agGridTable/customComponents/RentOrderDetailsRenderer';
import CustomerRenderer from '../components/agGridTable/customComponents/CustomerRenderer';

const RentBook = () => {
  const { data: rentOrders, isError: rentOrderError, isLoading } = useGetAllRentOrdersQuery();

  const nagivate = useNavigate();

  const defaultColDef: ColDef = { resizable: true };

  const handleOpen = () => {
    console.log('clicked open');
  };

  const initialColDefs: ColDef<RentOrderTableSchema>[] = [
    { headerName: 'Order Id', field: 'rentOrderId' },
    { headerName: 'Customer', field: 'customer', cellRenderer: CustomerRenderer, autoHeight: true },
    { headerName: 'Order Details', field: 'rentOrderDetails', cellRenderer: RentOrderDetailsRenderer, autoHeight: true, minWidth: 400 },
    { headerName: 'Rent Date', field: 'rentDate', valueFormatter: (params) => format(params.value as Date, 'dd-MM-yyyy') },
    { headerName: 'Return Date', field: 'returnDate', valueFormatter: (params) => format(params.value as Date, 'dd-MM-yyyy') },
    {
      headerName: 'Actions',
      field: 'action',
      cellRenderer: ActionButtons,
      cellRendererParams: (params: CustomCellRendererProps) => ({
        materialId: params.data?.rentOrderId,
        handleOpen,
      }),
    },
  ];
  const [rowData, setRowData] = useState<RentItemTableSchema[]>([]);
  const [colDefs, setColDefs] = useState<ColDef<RentItemTableSchema>[]>(initialColDefs);

  useEffect(() => {
    if (rentOrders) {
      const transformedRentOrders = rentOrders.map((item) => ({ ...item, action: 'action' }));
      setRowData(transformedRentOrders);
    }
    if (rentOrderError) {
      toast.error('Error when fetching Rent Orders');
    }
  }, [rentOrders, rentOrderError]);

  const handleNavigateToRentOrder = (rentOrderId?: number) => {
    nagivate('/secured/addRentOrder');
  };

  return (
    <div>
      <div className="d-flex">
        <div className="col-3 d-flex">
          <TextField
            label="Search Order"
            placeholder="Search by Barcode or contact or orderId"
            //   value={customerSearchQuery}
            //   onChange={(e) => setCustomerSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <button type="button" className="primary-btn" onClick={() => handleNavigateToRentOrder()}>
            Add new Rent Order
          </button>
        </div>
      </div>
      <div style={{ height: '40vw' }}>
        <MemoizedTable rowData={rowData} colDefs={colDefs} defaultColDef={defaultColDef} />
      </div>
    </div>
  );
};

export default RentBook;