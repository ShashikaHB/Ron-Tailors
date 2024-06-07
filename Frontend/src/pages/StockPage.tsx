import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import Table from "../components/data table/Table";
import axios from "axios";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import AddMaterialForm from "../components/forms/AddMaterialForm";

const StockPage = () => {
  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("brand", {
      header: () => <span>Brand</span>,
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor("color", {
      header: () => <span>Color</span>,
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor("noOfUnits", {
      header: () => "Available Units",
      cell: (props) => props.renderValue(),
    }),
    columnHelper.accessor("unitPrice", {
      header: "Unit Price",
    }),
    columnHelper.accessor("type", {
      header: () => <span>Type</span>,
    }),
    columnHelper.accessor("marginPercentage", {
      header: () => <span>Profit Margin</span>,
    }),
  ];

  const [rowData, setRowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTable, setRefreshTable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/material/"
        );
        setRowData(response.data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };

    fetchData();
  }, [refreshTable]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleAddMaterial = async () => {
    setRefreshTable(false); // Reset refreshTable state
    setOpen(false); // Close modal
    setRefreshTable(true); // Trigger table refresh
  };

  return (
    <div>
      <div className="d-flex justify-content-end">
          <button className="primary-button" onClick={handleOpen}>+ new Material</button>
      </div>
      {rowData && (
        <Table
          rowData={rowData}
          columns={columns}
          sortingColumn="brand"
        ></Table>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <AddMaterialForm
          handleClose={handleClose}
          handleAddMaterial={handleAddMaterial}
        ></AddMaterialForm>
      </Modal>
    </div>
  );
};

export default StockPage;
