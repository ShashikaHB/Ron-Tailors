import React from "react";
import Header from "../components/header/Header";
import SideNav from "../components/sideNav/SideNav";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="container-fluid">
      <Header></Header>
      <div className="row">
        <div className="col-3">
          <SideNav></SideNav>
        </div>
        <div className="col-9">
            <Outlet />
          </div>
      </div>
    </div>
  );
};

export default RootLayout;
