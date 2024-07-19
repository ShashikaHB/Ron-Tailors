import React from "react";
import { Outlet } from "react-router-dom";
import LoginLogo from "../assets/images/Rectangle 1.png";

const SignInSignUpLayout = () => {
  return (
    <div className="login-container">
      <div className="login-body">
        <div className="d-flex justify-content-center">
          <img className="top-bar-icon" src={LoginLogo} alt="react logo" />
        </div>
        <div>
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default SignInSignUpLayout;
