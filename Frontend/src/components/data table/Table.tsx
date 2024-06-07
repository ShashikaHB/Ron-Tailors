import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import Filters from "./table components/Filters";
import { Button, ButtonGroup } from "@mui/material";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { BiSort } from "react-icons/bi";

interface TableProps {
  rowData: any;
  columns: any;
  sortingColumn: string;
}

const Table = ({ rowData, columns, sortingColumn }: TableProps) => {
  const [data, setData] = useState(rowData);

  const [columnFilters, setColumnfilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    defaultColumn: {
      size: 100,
    },
    columnResizeMode: "onChange",
  });
  return (
    <div className="h-100 d-flex flex-column">
      <Filters
        column={sortingColumn}
        columnFilters={columnFilters}
        setColumnfilters={setColumnfilters}
      ></Filters>
      <div className="flex-grow-1 overflow-hidden d-flex flex-column">
        {data && data.length > 0 && (
          <table className="table overflow-y-auto h-100">
            <thead className="">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="" scope="col">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getCanSort() && (
                        <BiSort
                          onClick={header.column.getToggleSortingHandler()}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="overflow-y-auto">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="d-flex gap-2 align-items-center mb-2 justify-content-center">
        <div>
          page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <ButtonGroup>
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <BsArrowLeft />
          </Button>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <BsArrowRight />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default Table;
