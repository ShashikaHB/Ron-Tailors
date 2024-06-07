import { Button, Grid, TextField } from "@mui/material";
import { MdLockOutline } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const LoginPage = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/login",
        {
          mobile,
          password,
        }
      );

      if (response.status === 200) {
        // Handle successful login (e.g., save token, navigate to another page)
        console.log("Login successful:", response.data);
        navigate("/secured/"); // Navigate to the dashboard or another protected route
      } else {
        // Handle login failure (e.g., show error message)
        console.error("Login failed:", response.message);
        alert(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  };
  return (
    <>
      <div className="d-flex gap-2 flex-column">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="inputGroup">
            <TextField
              id="mobile"
              label="Mobile"
              variant="outlined"
              placeholder="Enter 10 digit mobile number"
              fullWidth
              required
              type="number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              placeholder="Enter password"
              fullWidth
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="w-100 mt-3">
            <button className="primary-button w-100" type="submit">
                  Login
            </button>
          </div>
        </form>
        <div>
          <p>
            Don't have account? <Link to="/public/signUp">Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
