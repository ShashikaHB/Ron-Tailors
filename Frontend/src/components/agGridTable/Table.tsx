/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
// React Grid Logic
import 'ag-grid-community/styles/ag-grid.css';
// Core CSS
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { memo, useEffect, useRef } from 'react';
import ProductRenderer from './customComponents/ProductRenderer';
import ActionButtons from './customComponents/ActionButtons';

type TableProps<T> = {
  rowData: T[];
  colDefs: (ColDef<T> | ColDef<T & { action?: string }>)[];
  defaultColDef?: ColDef;
  pagination?: boolean;
};

// Create new GridExample component
const Table = <T,>({ rowData, colDefs, defaultColDef, pagination }: TableProps<T>) => {
  // Container: Defines the grid's theme & dimensions.
  const gridRef = useRef<AgGridReact<T>>(null);

  const components = {
    productRenderer: ProductRenderer,
    actionButtons: ActionButtons,
  };

  const onGridReady = (params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  };

  useEffect(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.sizeColumnsToFit();
    }
  }, [rowData]);

  return (
    <div className="ag-theme-quartz h-100">
      <AgGridReact<T>
        ref={gridRef}
        rowData={rowData}
        columnDefs={colDefs as ColDef<T>[]}
        defaultColDef={defaultColDef}
        pagination={pagination ?? true}
        components={components}
        onGridReady={onGridReady}
      />
    </div>
  );
};

const MemoizedTable = memo(Table) as <T>(props: TableProps<T>) => JSX.Element;

export default MemoizedTable;
