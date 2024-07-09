import React, { useState } from "react";
import Table from "../components/agGridTable/Table";
import { ColDef } from "ag-grid-community";

// // Row Data Interface
type IRow = {
  make: string;
  model: string;
  price: number;
  electric: boolean;
};

export const Profile = () => {
  //   Row Data: The data to be displayed.
  const [rowData, setRowData] = useState<IRow[]>([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
  ]);

  //   Column Definitions: Defines & controls grid columns.
  const colDefs: ColDef<IRow>[] = [
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" },
  ];

  const defaultColDef: ColDef = {
    flex: 1,
  };

  return (
    <div className="h-100">
      <Table<IRow>
        rowData={rowData}
        colDefs={colDefs}
        defaultColDef={defaultColDef}
      />
    </div>
  );
};
