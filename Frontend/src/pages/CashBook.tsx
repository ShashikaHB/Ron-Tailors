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
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import MemoizedTable from '../components/agGridTable/Table';
import { useGetAllTransactionsQuery } from '../redux/features/transaction/transactionApiSlice';

const CashBook = () => {
  const { data: transactions, isError: transactionError, isLoading } = useGetAllTransactionsQuery({});

  const defaultColDef: ColDef = { resizable: true };

  const initialColDefs: ColDef<any>[] = [
    { headerName: 'Credits', field: 'credits', maxWidth: 400 },
    { headerName: 'Debits', field: 'debits', maxWidth: 400 },
  ];

  const [rowData, setRowData] = useState<any>([]);

  useEffect(() => {
    if (transactions) {
      const { credits, debits } = transactions;

      const transformedData = credits?.map((credit, index) => ({
        credits: `${credit.description}: $${credit.amount}`,
        debits: debits[index] ? `${debits[index].description}: $${debits[index].amount}` : '',
      }));

      setRowData(transformedData);
    }

    if (transactionError) {
      toast.error('Error when fetching Transactions');
    }
  }, [transactions, transactionError]);

  return (
    <div className="h-100 d-flex flex-column gap-3">
      <div className="flex-grow-1 overflow-hidden justify-content-center" style={{ width: '50vw' }}>
        <MemoizedTable rowData={rowData} colDefs={initialColDefs} defaultColDef={defaultColDef} />
      </div>
    </div>
  );
};

export default CashBook;
