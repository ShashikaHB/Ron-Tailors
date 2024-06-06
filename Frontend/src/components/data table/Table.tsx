import React, { useState } from "react";
import fakeData from "../../data.json";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import StatusCell from "./table components/StatusCell";
import Filters from "./table components/Filters";
import { Button, ButtonGroup, Icon, TextField } from "@mui/material";
import { ImSortAlphaAsc } from "react-icons/im";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor("id", {
    header: () => <span>ID</span>,
    cell: (props) => props.getValue(),
  }),
  columnHelper.accessor("albumId", {
    cell: StatusCell,
    header: () => <span>Album</span>,
    size: 150,
  }),
  columnHelper.accessor("title", {
    header: () => "Title",
    cell: (props) => props.renderValue(),
  }),
  columnHelper.accessor("url", {
    header: () => <span>URL</span>,
  }),
  columnHelper.accessor("thumbnailUrl", {
    header: "Thumbnail",
  }),
];

const Table = () => {
  const [data, setData] = useState(fakeData);
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
    <div>
      <Filters
        columnFilters={columnFilters}
        setColumnfilters={setColumnfilters}
      ></Filters>
      <table className="table">
        <thead className="tableHeading">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="th">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {header.column.getCanSort() && (
                    <ImSortAlphaAsc
                      onClick={header.column.getToggleSortingHandler()}
                    />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <p>
        page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </p>
      <ButtonGroup>
        <Button onClick={()=> table.previousPage()} disabled={!table.getCanPreviousPage()}> 
          <BsArrowLeft />
        </Button>
        <Button onClick={()=> table.nextPage()} disabled={!table.getCanNextPage()}>
          <BsArrowRight/>
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default Table;
