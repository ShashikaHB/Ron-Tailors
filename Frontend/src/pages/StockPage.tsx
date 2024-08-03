/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import {
  useState,
  useEffect,
  memo,
  useCallback,
} from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from '@hookform/devtools';
import Modal from '@mui/material/Modal';
import { FormProvider, useForm } from 'react-hook-form';
import { ColDef } from 'ag-grid-community';
import { CustomCellRendererProps } from 'ag-grid-react';
import Table from '../components/agGridTable/Table';
import AddMaterialForm from '../forms/materialAddEdit/AddMaterialForm';
import {
  MaterialSchema,
  defaultMaterialValues,
  materialSchema,
} from '../forms/formSchemas/materialsSchema';
import { useGetAllMaterialsQuery } from '../redux/features/material/materialApiSlice';
import { MaterialTableScheme } from '../types/material';
import ActionButtons from '../components/agGridTable/customComponents/ActionButtons';

const StockPage = () => {
  console.log('stock page rendered');

  const {
    data: materials,
    isError,
    isLoading,
    error,
  } = useGetAllMaterialsQuery();

  const [rowData, setRowData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] =
    useState<number | null>(null);

  const methods = useForm<MaterialSchema>({
    mode: 'all',
    resolver: zodResolver(materialSchema),
    defaultValues: defaultMaterialValues,
  });

  const handleOpen = useCallback(
    (materialId: number | null) => {
      setOpen(true);
      setSelectedMaterialId(materialId);
    },
    []
  );

  const lg = () => {
    console.log('hellooo');
  };

  const colDefs: ColDef<MaterialTableScheme>[] = [
    { headerName: 'Id', field: 'materialId' },
    { headerName: 'Name', field: 'name' },
    { headerName: 'Brand', field: 'brand' },
    { headerName: 'Color', field: 'color' },
    { headerName: 'Available Units', field: 'noOfUnits' },
    { headerName: 'Unit Price', field: 'unitPrice' },
    { headerName: 'Margin', field: 'marginPercentage' },
    { headerName: 'Type', field: 'type' },
    {
      headerName: 'Actions',
      field: 'action',
      cellRenderer: ActionButtons,
      cellRendererParams: (
        params: CustomCellRendererProps
      ) => ({
        materialId: params.data?.materialId,
        handleOpen,
        lg,
      }),
    },
  ];

  const defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
  };

  useEffect(() => {
    if (materials) {
      setRowData(materials);
    }
  }, [materials]);

  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <div className="h-100">
      <div className="d-flex justify-content-end mb-2">
        <button
          type="button"
          className="primary-button"
          onClick={() => handleOpen(null)}
        >
          + New Material
        </button>
      </div>
      {isLoading && <p>Loading!</p>}
      {isError && <p>Error loading data</p>}
      {!isLoading && !isError && rowData.length > 0 && (
        <Table<MaterialTableScheme>
          rowData={rowData}
          colDefs={colDefs}
          defaultColDef={defaultColDef}
        />
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <FormProvider {...methods}>
            <div>
              <AddMaterialForm
                handleClose={handleClose}
                materialId={selectedMaterialId}
              />
              <DevTool control={methods.control} />
            </div>
          </FormProvider>
        </div>
      </Modal>
    </div>
  );
};

export default memo(StockPage);
