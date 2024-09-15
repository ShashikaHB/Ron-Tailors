/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { ColDef } from 'ag-grid-community';
import { useCallback, useEffect, useState } from 'react';
import { FormControl, MenuItem, Modal, Select, TextField } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetFilteredTransactionsQuery } from '../redux/features/transaction/transactionApiSlice'; // Updated API call hook
import MemoizedTable from '../components/agGridTable/Table';
import AddTransaction from '../forms/transactionAddEdit/AddTransaction';
import { defaultTransactionValues, transactionSchema, TransactionSchema } from '../forms/formSchemas/transactionSchema';
import SimpleDatePicker from '../components/customFormComponents/simpleDatePicker/SimpleDatePicker';
import Stores from '../enums/Stores';
import stores from '../consts/stores';

const CashBook = () => {
  const [selectedFromDate, setSelectedFromDate] = useState<Date>(new Date());
  const [selectedToDate, setSelectedToDate] = useState<Date>(new Date());

  const [selectedStore, setSelectedStore] = useState<any>(Stores.Kegalle);

  // Fetch transactions with the selected date range
  const {
    data: transactions,
    isLoading,
    isError,
  } = useGetFilteredTransactionsQuery({
    fromDate: selectedFromDate?.toISOString(),
    toDate: selectedToDate?.toISOString(),
    store: selectedStore,
  });

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  // Income breakdowns
  const [totalCashIncome, setTotalCashIncome] = useState(0);
  const [totalCardIncome, setTotalCardIncome] = useState(0);
  const [totalBankTransferIncome, setTotalBankTransferIncome] = useState(0);

  // Expense breakdowns
  const [totalCashExpense, setTotalCashExpense] = useState(0);
  const [totalCardExpense, setTotalCardExpense] = useState(0);
  const [totalBankTransferExpense, setTotalBankTransferExpense] = useState(0);

  const handleFromDateChange = (date: Date) => {
    setSelectedFromDate(date); // Trigger a new fetch when the fromDate changes
  };

  const handleToDateChange = (date: Date) => {
    setSelectedToDate(date); // Trigger a new fetch when the toDate changes
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

  const handleStoreChange = (event: any) => {
    setSelectedStore(event.target.value as string);
  };

  const clearBalancesForm = () => {
    // Set calculated values
    setTotalIncome(0);
    setTotalExpense(0);
    setTotalCashIncome(0);
    setTotalCardIncome(0);
    setTotalBankTransferIncome(0);
    setTotalCashExpense(0);
    setTotalCardExpense(0);
    setTotalBankTransferExpense(0);
  };

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

      // Calculate totals based on filtered transactions
      let income = 0;
      let expense = 0;
      let cashIncome = 0;
      let cardIncome = 0;
      let bankTransferIncome = 0;
      let cashExpense = 0;
      let cardExpense = 0;
      let bankTransferExpense = 0;

      transactions.forEach((transaction: any) => {
        const { transactionType, paymentType, amount } = transaction;

        // Income Calculations
        if (transactionType === 'Income') {
          income += amount;

          if (paymentType === 'Cash') cashIncome += amount;
          else if (paymentType === 'Card') cardIncome += amount;
          else if (paymentType === 'Bank Transfer') bankTransferIncome += amount;

          // Expense Calculations
        } else if (transactionType === 'Expense') {
          expense += amount;

          if (paymentType === 'Cash') cashExpense += amount;
          else if (paymentType === 'Card') cardExpense += amount;
          else if (paymentType === 'Bank Transfer') bankTransferExpense += amount;
        }
      });

      // Set calculated values
      setTotalIncome(income);
      setTotalExpense(expense);
      setTotalCashIncome(cashIncome);
      setTotalCardIncome(cardIncome);
      setTotalBankTransferIncome(bankTransferIncome);
      setTotalCashExpense(cashExpense);
      setTotalCardExpense(cardExpense);
      setTotalBankTransferExpense(bankTransferExpense);
    }

    if (isError) {
      setRowData([]);
      clearBalancesForm();
    }
  }, [transactions, isError]);

  return (
    <div className="h-100 d-flex flex-column gap-3">
      <div className="d-flex col-3 gap-3">
        <SimpleDatePicker label="From Date" onDateChange={handleFromDateChange} />
        <SimpleDatePicker label="To Date" onDateChange={handleToDateChange} />
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
      {/* Income Section */}
      <div className="d-flex col-9 gap-3">
        <TextField label="Cash Income" value={totalCashIncome} disabled />
        <TextField label="Card Income" value={totalCardIncome} disabled />
        <TextField label="Bank Transfer Income" value={totalBankTransferIncome} disabled />
        <TextField label="Total Income" value={totalIncome} disabled />
      </div>

      {/* Expense Section */}
      <div className="d-flex col-9 gap-3">
        <TextField label="Cash Expense" value={totalCashExpense} disabled />
        <TextField label="Card Expense" value={totalCardExpense} disabled />
        <TextField label="Bank Transfer Expense" value={totalBankTransferExpense} disabled />
        <TextField label="Total Expense" value={totalExpense} disabled />
      </div>

      {/* Balance Section */}
      <div className="d-flex col-9 gap-3">
        <TextField label="Cash Balance" value={totalCashIncome - totalCashExpense} disabled />
        <TextField label="Card Balance" value={totalCardIncome - totalCardExpense} disabled />
        <TextField label="Bank Account Balance" value={totalBankTransferIncome - totalBankTransferExpense} disabled />
        <TextField label="Total Balance" value={totalIncome - totalExpense} disabled />
      </div>
      <div className="d-flex justify-content-end">
        <button type="button" className="primary-button" onClick={() => handleOpen()}>
          + New Transaction
        </button>
      </div>
      <div className="flex-grow-1 overflow-hidden justify-content-center">
        <MemoizedTable rowData={rowData} colDefs={initialColDefs} defaultColDef={defaultColDef} />
      </div>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div>
          <FormProvider {...methods}>
            <div>
              <AddTransaction handleClose={handleClose} />
            </div>
          </FormProvider>
        </div>
      </Modal>
    </div>
  );
};

export default CashBook;
