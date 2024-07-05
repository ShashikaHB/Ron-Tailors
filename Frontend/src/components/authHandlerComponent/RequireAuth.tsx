import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/features/auth/authSlice";

const RequireAuth = () => {
  const token = useSelector(selectToken);
  const location = useLocation();

  return token ? (
    <Outlet></Outlet>
  ) : (
    <Navigate to={"/login"} state={{ from: location }} replace />
  );
};

export default RequireAuth;
