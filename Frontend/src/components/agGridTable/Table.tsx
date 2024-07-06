// Theme
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
// React Grid Logic
import "ag-grid-community/styles/ag-grid.css";
// Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useState, memo, useRef } from "react";

type TableProps<T> = {
  rowData: T[];
  colDefs: ColDef<T>[];
  defaultColDef?: ColDef;
};

// Create new GridExample component
const Table = <T,>({ rowData, colDefs, defaultColDef }: TableProps<T>) => {
  // Container: Defines the grid's theme & dimensions.
  const gridRef = useRef<AgGridReact<T>>(null);

  return (
    <div className={"ag-theme-quartz"} style={{ width: "95%", height: "95%" }}>
      <AgGridReact<T>
        ref={gridRef}
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        domLayout="autoHeight"
        pagination={true}
      />
    </div>
  );
};

const MemoizedTable = memo(Table) as <T>(props: TableProps<T>) => JSX.Element;

export default MemoizedTable;
