/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { ColDef } from 'ag-grid-community';
import { useCallback, useEffect, useState } from 'react';
import { FormControl, MenuItem, Modal, Select } from '@mui/material';
import { toast } from 'sonner';
import { useDeleteTransactionCategoryMutation, useGetAllDayEndRecordsQuery } from '../redux/features/transaction/transactionApiSlice';
import MemoizedTable from '../components/agGridTable/Table';
import stores from '../consts/stores';
import Stores from '../enums/Stores';
import AddDayEnd from '../forms/dayEndAdd/AddDayEnd';
import { useAppDispatch } from '../redux/reduxHooks/reduxHooks';
import { setLoading } from '../redux/features/common/commonSlice';

const DailySummary = () => {
  const [selectedStore, setSelectedStore] = useState<any>(Stores.Kegalle);

  const { data: dailySummary, isLoading } = useGetAllDayEndRecordsQuery(selectedStore);

  const [open, setOpen] = useState(false);

  const [deleteCategory, { isLoading: deletingCategory }] = useDeleteTransactionCategoryMutation();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading]);
  useEffect(() => {
    dispatch(setLoading(deletingCategory));
  }, [deletingCategory]);

  const handleStoreChange = (event: any) => {
    setSelectedStore(event.target.value as string);
  };

  const handleClose = useCallback(() => setOpen(false), []);
  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleRemove = async (transactionCategory: string) => {
    const response = await deleteCategory(transactionCategory);
    if (response.data.success) {
      toast.success(response.data.message);
    }
  };

  const defaultColDef: ColDef = { resizable: true };

  const initialColDefs: ColDef<any>[] = [
    { headerName: 'Date', field: 'date', maxWidth: 400 },
    { headerName: 'Expenses', field: 'totalExpense', maxWidth: 400 },
    { headerName: 'Income', field: 'totalIncome', maxWidth: 400 },
    { headerName: 'Cash Income', field: 'cashIncome', maxWidth: 400 },
    { headerName: 'Card Income', field: 'cardIncome', maxWidth: 400 },
    { headerName: 'Bank Transfer Income', field: 'bankTransferIncome', maxWidth: 400 },
    { headerName: 'Counted Cash', field: 'countedCash', maxWidth: 400 },
    { headerName: 'Difference', field: 'difference', maxWidth: 400 },
  ];

  const [rowData, setRowData] = useState<any>([]);

  useEffect(() => {
    if (dailySummary) {
      setRowData(dailySummary);
    }
  }, [dailySummary]);

  return (
    <div className="h-100 d-flex flex-column gap-3">
      <div className="d-flex">
        <div className="row w-100 justify-content-end mx-0 g-0 gap-3">
          <div className="col-3">
            <FormControl sx={{ m: 1, maxWidth: 165 }} size="small">
              <Select value={selectedStore} onChange={handleStoreChange}>
                {stores.map((option) => (
                  <MenuItem key={option.value} value={option.value} disabled={!option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="col-auto">
            <button type="button" className="primary-button" onClick={() => handleOpen()}>
              + Add Day End
            </button>
          </div>
        </div>
      </div>
      <div className="flex-grow-1 overflow-hidden justify-content-center">
        <MemoizedTable rowData={rowData} colDefs={initialColDefs} defaultColDef={defaultColDef} />
      </div>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div>
          <div>
            <AddDayEnd handleClose={handleClose} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DailySummary;
