import { MenuItem, TextField } from "@mui/material";
import axios from "axios";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const roles = [
    {
      value: "Admin",
      label: "Admin",
    },
    {
      value: "Sales Person",
      label: "Sales Person",
    },
    {
      value: "Cutter",
      label: "Cutter",
    },
    {
      value: "Tailor",
      label: "Tailor",
    },
  ];
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/register",
        {
          mobile,
          password,
          role,
          name,
        }
      );

      if (response.status === 200) {
        // Handle successful login (e.g., save token, navigate to another page)
        console.log("Login successful:", response.data);
        navigate("/public/login"); // Navigate to the dashboard or another protected route
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
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="inputGroup gap-4 d-flex flex-column mt-4">
            <TextField
              id="filled-basic"
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
              id="filled-basic"
              label="Name"
              variant="outlined"
              placeholder="Enter your name"
              fullWidth
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              id="filled-basic"
              label="Password"
              variant="outlined"
              placeholder="Enter your password"
              fullWidth
              required
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              id="outlined-select-currency"
              select
              label="Please Select your role"
              defaultValue="Sales Person"
              helperText="Please select your Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {roles.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  //   onClick={() => setRole(option.value)}
                >
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="w-100 mt-4 mb-4">
            <button className="primary-button w-100" type="submit">
              Sign Up
            </button>
          </div>
        </form>
        <div>
          <p>
            Already Have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
