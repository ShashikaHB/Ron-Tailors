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
import { DevTool } from '@hookform/devtools';
import { Modal, TextField } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetAllTransactionsQuery } from '../redux/features/transaction/transactionApiSlice';
import MemoizedTable from '../components/agGridTable/Table';
import AddTransaction from '../forms/transactionAddEdit/AddTransaction';
import { defaultTransactionValues, transactionSchema, TransactionSchema } from '../forms/formSchemas/transactionSchema';
import SimpleDatePicker from '../components/customFormComponents/simpleDatePicker/SimpleDatePicker';

const CashBook = () => {
  const { data: transactions, isError: transactionError, isLoading } = useGetAllTransactionsQuery({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date); // Set the selected date from the child component
  };

  const methods = useForm<TransactionSchema>({
    mode: 'all',
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultTransactionValues,
  });

  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => setOpen(false), []);
  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const defaultColDef: ColDef = { resizable: true };

  const initialColDefs: ColDef<any>[] = [
    { headerName: 'Date', field: 'date', maxWidth: 400 },
    { headerName: 'Transaction Category', field: 'transactionCategory', maxWidth: 400 },
    { headerName: 'Transaction Type', field: 'transactionType', maxWidth: 400 },
    { headerName: 'Payment Type', field: 'paymentType', maxWidth: 400 },
    { headerName: 'Amount', field: 'amount', maxWidth: 400 },
    { headerName: 'Recorded By', field: 'salesPerson', maxWidth: 400 },
  ];

  const [rowData, setRowData] = useState<any>([]);

  useEffect(() => {
    if (transactions) {
      setRowData(transactions);
    }
  }, [transactions]);

  return (
    <div className="h-100 d-flex flex-column gap-3">
      <div className="d-flex justify-content-end">
        <button type="button" className="primary-button" onClick={() => handleOpen()}>
          + New Transaction
        </button>
      </div>
      <div className="d-flex col-3 gap-3">
        <SimpleDatePicker label="From Date" onDateChange={handleDateChange} />
        <SimpleDatePicker label="To Date" onDateChange={handleDateChange} />
      </div>
      <div className="d-flex col-9 gap-3">
        <TextField label="Total Cash Income" />
        <TextField label="Total Cash Expense " />
        <TextField label="Total Cash Balance " />
        <TextField label="Total Credit Card Income" />
      </div>
      <div className="flex-grow-1 overflow-hidden justify-content-center">
        <MemoizedTable rowData={rowData} colDefs={initialColDefs} defaultColDef={defaultColDef} />
      </div>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div>
          <FormProvider {...methods}>
            <div>
              <AddTransaction handleClose={handleClose} />
              <DevTool control={methods.control} />
            </div>
          </FormProvider>
        </div>
      </Modal>
    </div>
  );
};

export default CashBook;
