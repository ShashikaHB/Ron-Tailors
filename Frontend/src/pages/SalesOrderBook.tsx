/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { ColDef } from 'ag-grid-community';
import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Modal, TextField } from '@mui/material';
import { DevTool } from '@hookform/devtools';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import MemoizedTable from '../components/agGridTable/Table';
import CustomerRenderer from '../components/agGridTable/customComponents/CustomerRenderer';
import { useGetAllSalesOrdersQuery } from '../redux/features/orders/orderApiSlice';
import SalesOrderDetailsRenderer from '../components/agGridTable/customComponents/SalesOrderDetailsRenderer';
import ActionButtonNew from '../components/agGridTable/customComponents/ActionButtonNew';
import AddEditProduct from '../forms/productAddEdit/AddEditProduct';
import { MeasurementSchema, measurementSchema, defaultMeasurementValues } from '../forms/formSchemas/measurementSchema';
import { ProductSchema, productSchema, defaultProductValues } from '../forms/formSchemas/productSchema';
import { setSelectedProduct } from '../redux/features/product/productSlice';
import { useAppDispatch } from '../redux/reduxHooks/reduxHooks';
import PrintMeasurement from '../forms/printMeasurement/PrintMeasurement';

const SalesOrderBook = () => {
  const { data: salesOrders, isError: salesOrderError, isLoading } = useGetAllSalesOrdersQuery('');

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

  const nagivate = useNavigate();

  const defaultColDef: ColDef = { resizable: true };

  const handleOpen = (id: string) => {
    nagivate(`/secured/addSalesOrder/${id}`);
  };

  const [openProducts, setOpenProducts] = useState(false);
  const [openMeasurement, setOpenMeasurement] = useState(false);

  const handleOpenMeasurement = useCallback(() => {
    setOpenMeasurement(true);
    dispatch(setSelectedProduct(productId));
  }, []);
  const handleOpenProductEdit = useCallback((productId: number) => {
    setOpenProducts(true);
    dispatch(setSelectedProduct(productId));
  }, []);

  const initialColDefs: ColDef<any>[] = [
    { headerName: 'Order Id', field: 'salesOrderId', minWidth: 100 },
    { headerName: 'Customer', field: 'customer', cellRenderer: CustomerRenderer, autoHeight: true, minWidth: 200 },
    {
      headerName: 'Order Details',
      field: 'orderDetails',
      cellRenderer: SalesOrderDetailsRenderer,
      cellRendererParams: { handleOpenMeasurement, handleOpenProductEdit },
      autoHeight: true,
      minWidth: 400,
    },
    { headerName: 'Order Date', field: 'orderDate', valueFormatter: (params) => format(params.value as Date, 'dd-MM-yyyy') },
    { headerName: 'Delivery Date', field: 'deliveryDate', valueFormatter: (params) => format(params.value as Date, 'dd-MM-yyyy') },
    {
      headerName: 'Actions',
      field: 'action',
      cellRenderer: ActionButtonNew,
      cellRendererParams: {
        handleEdit: handleOpen,
        idType: 'salesOrderId',
        isOrderBook: true,
      },
    },
  ];
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDefs, setColDefs] = useState<ColDef<any>[]>(initialColDefs);

  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  const handleNavigateToRentOrder = (rentOrderId?: number) => {
    nagivate('/secured/addSalesOrder');
  };

  const handleClose = useCallback(() => setOpenProducts(false), []);
  const handleMeasurementClose = useCallback(() => setOpenMeasurement(false), []);

  useEffect(() => {
    if (salesOrders) {
      const transformedRentOrders = salesOrders.map((item: any) => ({ ...item, action: 'action' }));
      setRowData(transformedRentOrders);
    }
  }, [salesOrders]);

  useEffect(() => {
    if (orderSearchQuery !== '') {
      const lowercasedFilter = orderSearchQuery.toLowerCase();
      const filteredRowData = salesOrders.filter(
        (item: any) =>
          item.salesOrderId.toString().toLowerCase().includes(lowercasedFilter) ||
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
        <div className="d-flex gap-3">
          <button type="button" className="primary-button" onClick={() => handleOpenMeasurement()}>
            Print Measurement
          </button>
          <button type="button" className="primary-button" onClick={() => handleNavigateToRentOrder()}>
            +Add new Sales Order
          </button>
        </div>
      </div>
      <div className="flex-grow-1 overflow-hidden">
        <MemoizedTable rowData={rowData} colDefs={colDefs} defaultColDef={defaultColDef} />
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
          <PrintMeasurement handleClose={handleMeasurementClose} />
        </div>
      </Modal>
    </div>
  );
};

export default SalesOrderBook;
