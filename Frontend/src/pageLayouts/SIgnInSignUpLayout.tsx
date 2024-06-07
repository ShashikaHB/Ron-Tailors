import { Grid, Paper } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

const SIgnInSignUpLayout = () => {
  const paperStyle = {
    padding: 20,
    height: "75vh",
    width: "40vw",
    margin: "20px auto",
  };
  return (
    <>
      <div>LOGO</div>
      <Grid>
        <Paper elevation={10} style={paperStyle}>
          <Outlet></Outlet>
        </Paper>
      </Grid>
    </>
  );
};

export default SIgnInSignUpLayout;
