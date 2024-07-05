<h1>OOPS Error</h1>;
import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>OOPS Error</h1>
      <button onClick={() => navigate("/login")}></button>
    </div>
  );
};

export default ErrorPage;
