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
import { Modal } from '@mui/material';
import { toast } from 'sonner';
import { useDeleteTransactionCategoryMutation, useGetAllDayEndRecordsQuery } from '../redux/features/transaction/transactionApiSlice';
import MemoizedTable from '../components/agGridTable/Table';
import AddDayEnd from '../forms/dayEndAdd/AddDayEnd';
import { useAppDispatch } from '../redux/reduxHooks/reduxHooks';
import { setLoading } from '../redux/features/common/commonSlice';

const DailySummary = () => {
  const { data: dailySummary, isLoading: dayEndLoading } = useGetAllDayEndRecordsQuery({});

  const [open, setOpen] = useState(false);

  const [deleteCategory, { isLoading: deletingCategory }] = useDeleteTransactionCategoryMutation();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoading(dayEndLoading));
  }, [dayEndLoading]);
  useEffect(() => {
    dispatch(setLoading(deletingCategory));
  }, [deletingCategory]);

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
