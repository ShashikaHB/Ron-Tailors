import { createColumnHelper } from "@tanstack/react-table";
import { useState, useEffect, memo, useCallback } from "react";
import Table from "../components/agGridTable/Table";
import { zodResolver } from "@hookform/resolvers/zod";
import { DevTool } from "@hookform/devtools";
import Modal from "@mui/material/Modal";
import AddMaterialForm from "../forms/materialAddEdit/AddMaterialForm";
import {
  MaterialSchema,
  defaultMaterialValues,
  materialSchema,
} from "../forms/formSchemas/materialsSchema";
import { FormProvider, useForm } from "react-hook-form";
import { useGetAllMaterialsQuery } from "../redux/features/material/materialApiSlice";
import { GetMaterial, Material, MaterialTableScheme } from "../types/material";
import { ColDef } from "ag-grid-community";
import ActionButtons from "../components/agGridTable/customComponents/ActionButtons";
import { CustomCellRendererProps } from "ag-grid-react";

const StockPage = () => {
  console.log("stock page rendered");

  const methods = useForm<MaterialSchema>({
    mode: "all",
    resolver: zodResolver(materialSchema),
    defaultValues: defaultMaterialValues,
  });

  const lg = () => {
    console.log("hellooo");
  };

  const handleOpen = useCallback((materialId: number | null) => {
    setOpen(true);
    setSelectedMaterialId(materialId);
  }, []);

  const colDefs: ColDef<MaterialTableScheme>[] = [
    { headerName: "Id", field: "materialId" },
    { headerName: "Name", field: "name" },
    { headerName: "Brand", field: "brand" },
    { headerName: "Color", field: "color" },
    { headerName: "Available Units", field: "noOfUnits" },
    { headerName: "Unit Price", field: "unitPrice" },
    { headerName: "Margin", field: "marginPercentage" },
    { headerName: "Type", field: "type" },
    {
      headerName: "Actions",
      field: "action",
      cellRenderer: ActionButtons,
      cellRendererParams: (params: CustomCellRendererProps) => ({
        materialId: params.data?.materialId,
        handleOpen: handleOpen,
        lg: lg,
      }),
    },
  ];

  const defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
  };

  const {
    data: materials,
    isError,
    isLoading,
    error,
  } = useGetAllMaterialsQuery();

  const [rowData, setRowData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (materials) {
      setRowData(materials);
    }
  }, [materials]);

  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <div className="h-100">
      <div className="d-flex justify-content-end mb-2">
        <button className="primary-button" onClick={() => handleOpen(null)}>
          + New Material
        </button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error loading data: errror</p>
      ) : (
        rowData && (
          <Table<MaterialTableScheme>
            rowData={rowData}
            colDefs={colDefs}
            defaultColDef={defaultColDef}
          ></Table>
        )
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
