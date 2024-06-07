import { Search } from "@mui/icons-material";
import { Box, TextField } from "@mui/material";
import React from "react";
import { FaSearch } from "react-icons/fa";

const Filters = ({ columnFilters, setColumnfilters, column }) => {
  const title = columnFilters.find((item) => item.id === column)?.value || "";

  const onFilterChange = (id, value) => {
    setColumnfilters((prev) =>
      prev
        .filter((f) => f.id !== id)
        .concat({
          id,
          value,
        })
    );
  };

  return (
    <Box
      component="form"
      sx={{ "& > :not(style)": { m: 1 } }}
      noValidate
      autoComplete="off"
    >
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
        <Search sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <TextField
          id="input-with-sx"
          label="Search"
          variant="standard"
          value={title}
          onChange={(e) => onFilterChange(column, e.target.value)}
        />
      </Box>
    </Box>
  );
};

export default Filters;
