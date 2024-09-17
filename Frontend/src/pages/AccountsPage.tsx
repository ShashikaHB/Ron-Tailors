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
import { Modal } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useDeleteTransactionCategoryMutation, useGetAllTransactionCategoriesQuery } from '../redux/features/transaction/transactionApiSlice';
import MemoizedTable from '../components/agGridTable/Table';
import { defaultTransactionCategoryValues, transactionCategorySchema, TransactionCategorySchema } from '../forms/formSchemas/transactionCategorySchema';
import AddTransactionCategory from '../forms/transactionCategoryAddEdit/AddTransactionCategory';
import ActionButtonNew from '../components/agGridTable/customComponents/ActionButtonNew';

const AccountsPage = () => {
  const { data: transactionCategories, isError: transactionError, isLoading } = useGetAllTransactionCategoriesQuery({});

  const methods = useForm<TransactionCategorySchema>({
    mode: 'all',
    resolver: zodResolver(transactionCategorySchema),
    defaultValues: defaultTransactionCategoryValues,
  });

  const [open, setOpen] = useState(false);

  const [deleteCategory] = useDeleteTransactionCategoryMutation();

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
    { headerName: 'Transaction Category', field: 'transactionCategory', maxWidth: 400 },
    { headerName: 'Transaction Type', field: 'transactionType', maxWidth: 400 },
    {
      headerName: '',
      cellRenderer: ActionButtonNew,
      cellRendererParams: {
        handleDelete: handleRemove,
        idType: 'transactionCategory',
      },
    },
  ];

  const [rowData, setRowData] = useState<any>([]);

  useEffect(() => {
    if (transactionCategories) {
      setRowData(transactionCategories);
    }
  }, [transactionCategories]);

  return (
    <div className="h-100 d-flex flex-column gap-3">
      <div className="d-flex justify-content-end">
        <button type="button" className="primary-button" onClick={() => handleOpen()}>
          + New Category
        </button>
      </div>
      <div className="flex-grow-1 overflow-hidden justify-content-center">
        <MemoizedTable rowData={rowData} colDefs={initialColDefs} defaultColDef={defaultColDef} />
      </div>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div>
          <FormProvider {...methods}>
            <div>
              <AddTransactionCategory handleClose={handleClose} />
              <DevTool control={methods.control} />
            </div>
          </FormProvider>
        </div>
      </Modal>
    </div>
  );
};

export default AccountsPage;
