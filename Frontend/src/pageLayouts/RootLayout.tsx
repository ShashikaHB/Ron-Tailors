import React from "react";
import Header from "../components/header/Header";
import SideNav from "../components/sideNav/SideNav";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className='d-flex flex-grow-1'>
      <div className='d-flex flex-column h-100 w-100'>
        <Header></Header>
        <div className="row flex-grow-1 overflow-hidden mx-0">
          <div className="col-12 col-12 flex-grow-1 overflow-hidden d-flex flex-column h-100">
            <div className="row h-100 flex-grow-1 overflow-hidden d-flex flex-column h-100">
              <div className="col-3 flex-grow-1 overflow-hidden d-flex flex-column h-100">
                <SideNav></SideNav>
              </div>
              <div className="col-9 flex-grow-1 overflow-hidden d-flex flex-column h-100">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
