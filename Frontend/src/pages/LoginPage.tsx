import { TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { setCredentials } from "../redux/features/auth/authSlice";
import { useLoginMutation } from "../redux/features/auth/authApiSlice";
import { toast } from "sonner";
import { useAppDispatch } from "../redux/reduxHooks/reduxHooks";

const LoginPage = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [login, { isLoading, isError }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userData = await login({ mobile, password }).unwrap();
      dispatch(setCredentials({ ...userData }));
      navigate("/secured/dashboard");
      toast.success("Login Success!");
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  const content = isLoading ? (
    <h1>Loading ....</h1>
  ) : (
    <>
      <div className="d-flex gap-2 flex-column">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="inputGroup gap-4 d-flex flex-column mt-4">
            <TextField
              id="mobile"
              label="Mobile"
              variant="outlined"
              placeholder="Enter 10 digit mobile number"
              fullWidth
              required
              type="number"
              error={isError}
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
              error={isError}
              helperText={isError ? "User name or password is invalid" : null}
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
            Don't have account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
  return content;
};

export default LoginPage;
