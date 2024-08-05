/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { Modal, TextField } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { useCallback, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColDef } from 'ag-grid-community';
import { toast } from 'sonner';
import AddEditRentItemForm from '../forms/newRentItemAddEdit/AddEditRentItem';
import { defaultRentItemValues, rentItemSchema, RentItemSchema } from '../forms/formSchemas/rentItemSchema';
import MemoizedTable from '../components/agGridTable/Table';
import { RentItemTableSchema } from '../types/rentItem';
import { useDeleteRentItemMutation, useGetAllRentItemsQuery } from '../redux/features/rentItem/rentItemApiSlice';
import { useAppDispatch } from '../redux/reduxHooks/reduxHooks';
import { setSelectedRentItemId } from '../redux/features/orders/orderSlice';
import ActionButtonNew from '../components/agGridTable/customComponents/ActionButtonNew';

const AddRentItem = () => {
  const { data: rentItems, isError, isLoading, error } = useGetAllRentItemsQuery();
  const [deleteRentItem, { isError: deleteError }] = useDeleteRentItemMutation();
  const methods = useForm<RentItemSchema>({
    mode: 'all',
    resolver: zodResolver(rentItemSchema),
    defaultValues: defaultRentItemValues,
  });
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback((rentItemId: number) => {
    setOpen(true);
    dispatch(setSelectedRentItemId(rentItemId));
  }, []);

  const handleDelete = (id: number) => {
    deleteRentItem(id);
  };

  const initialColDefs: ColDef<RentItemTableSchema>[] = [
    { headerName: 'Barcode', field: 'rentItemId' },
    { headerName: 'Description', field: 'description' },
    { headerName: 'Color', field: 'color' },
    { headerName: 'Size', field: 'size' },
    { headerName: 'Status', field: 'status' },
    { headerName: 'Type', field: 'type' },
    {
      headerName: 'Actions',
      field: 'action',
      cellRenderer: ActionButtonNew,
      cellRendererParams: {
        handleEdit: handleOpen,
        handleDelete,
        idType: 'rentItemId',
      },
    },
  ];
  const [rowData, setRowData] = useState<RentItemTableSchema[]>([]);
  const [colDefs, setColDefs] = useState<ColDef<RentItemTableSchema>[]>(initialColDefs);

  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  const defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
  };

  const handlePopupClose = useCallback(() => {
    setOpen(false);
    dispatch(setSelectedRentItemId(0));
  }, []);

  useEffect(() => {
    if (rentItems) {
      const transformedData = rentItems.map((item) => ({
        ...item,
        action: 'action', // Ensure the action field is included
      }));
      setRowData(transformedData);
    }
    if (isError || deleteError) {
      toast.error('Rent Items fetching failed!');
    }
  }, [rentItems, isError, deleteError]);

  useEffect(() => {
    if (orderSearchQuery !== '') {
      const lowercasedFilter = orderSearchQuery.toLowerCase();
      const filteredRowData = rentItems?.filter(
        (item: any) =>
          item.rentItemId.toString().toLowerCase().includes(lowercasedFilter) ||
          item.color.toLowerCase().includes(lowercasedFilter) ||
          item.size.toLowerCase().includes(lowercasedFilter)
      );
      setRowData(filteredRowData);
    } else {
      setRowData(rentItems);
    }
  }, [orderSearchQuery]);

  return (
    <div className="h-100 d-flex flex-column gap-3">
      <div className="d-flex justify-content-between align-items-end">
        <div className="w-50 d-flex">
          <TextField
            label="Barcode"
            placeholder="Search the product by Barcode"
            value={orderSearchQuery}
            onChange={(e) => setOrderSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <button type="button" className="primary-button" onClick={() => setOpen(!open)}>
            Add new Rent Item
          </button>
        </div>
      </div>
      <div className="flex-grow-1 overflow-hidden">
        <MemoizedTable rowData={rowData} colDefs={colDefs} defaultColDef={defaultColDef} />
      </div>
      <Modal open={open} onClose={handlePopupClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div>
          <FormProvider {...methods}>
            <div>
              <AddEditRentItemForm handleClose={handlePopupClose} />
              <DevTool control={methods.control} />
            </div>
          </FormProvider>
        </div>
      </Modal>
    </div>
  );
};

export default AddRentItem;
