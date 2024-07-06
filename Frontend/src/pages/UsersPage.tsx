import { Button } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "../components/dataTable/Table";

const UsersPage = () => {
  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("name", {
      header: () => <span>Name</span>,
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor("mobile", {
      header: () => <span>Mobile</span>,
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor("role", {
      header: () => "Role",
      cell: (props) => props.renderValue(),
    }),
    columnHelper.accessor("salary", {
      header: "Salary",
    }),
  ];

  const [rowData, setRowData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/auth/");
        setRowData(response.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Button>+ new User</Button>
      {rowData && (
        <Table rowData={rowData} columns={columns} sortingColumn="name"></Table>
      )}
    </div>
  );
};

export default UsersPage;
