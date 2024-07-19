// Theme
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
// React Grid Logic
import "ag-grid-community/styles/ag-grid.css";
// Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useState, memo, useRef } from "react";
import { boolean } from "zod";
import ProductRenderer from "./customComponents/ProductRenderer";
import ActionButtons from "./customComponents/ActionButtons";

type TableProps<T> = {
  rowData: T[];
  colDefs: ColDef<T>[];
  defaultColDef?: ColDef;
  pagination?: boolean;
};

// Create new GridExample component
const Table = <T,>({
  rowData,
  colDefs,
  defaultColDef,
  pagination,
}: TableProps<T>) => {
  // Container: Defines the grid's theme & dimensions.
  const gridRef = useRef<AgGridReact<T>>(null);

  const components = {
    productRenderer: ProductRenderer,
    actionButtons: ActionButtons,
  };

  return (
    <div className="ag-theme-quartz h-100">
      <AgGridReact<T>
        ref={gridRef}
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={pagination ?? true}
        components={components}
      />
    </div>
  );
};

const MemoizedTable = memo(Table) as <T>(props: TableProps<T>) => JSX.Element;

export default MemoizedTable;
