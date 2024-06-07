import { Button } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import StatusCell from "../components/data table/table components/StatusCell";
import fakeData from "../data.json";
import Table from "../components/data table/Table";
import axios from "axios";
import OrderDetails from "../components/data table/table components/OrderDetails";

const SalesOrderPage = () => {
  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("customer.name", {
      header: () => <span>Customer Name</span>,
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor("customer.mobile", {
      header: () => <span>Mobile</span>,
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor("orderDetails", {
      header: () => <span>Order Details</span>,
      cell: OrderDetails,
    }),
    columnHelper.accessor("salesPerson.name", {
      header: () => "Sales Person",
      cell: (props) => props.renderValue(),
    }),
    columnHelper.accessor("totalPrice", {
      header: () => <span>Total</span>,
      cell: (props) => props.renderValue(),
    }),
    columnHelper.accessor("paymentType", {
      header: "Payment Type",
      cell: (props) => props.renderValue(),
    }),
    columnHelper.accessor("isNewRentOut", {
      header: "New Rent Out",
      cell: (props) => (props.renderValue() ? "Yes" : "No"),
    }),
  ];

  const [rowData, setRowData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/order/");
        setRowData(response.data.data);

        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Button>+ new Order</Button>
      {rowData && (
        <Table
          rowData={rowData}
          columns={columns}
          sortingColumn="paymentType"
        ></Table>
      )}
    </div>
  );
};

export default SalesOrderPage;
