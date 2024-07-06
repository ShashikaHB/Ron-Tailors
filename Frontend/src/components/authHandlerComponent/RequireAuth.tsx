import { useLocation, Navigate, Outlet } from "react-router-dom";
import { selectToken } from "../../redux/features/auth/authSlice";
import { useAppSelector } from "../../redux/reduxHooks/reduxHooks";

const RequireAuth = () => {
  const token = useAppSelector(selectToken);
  const location = useLocation();

  return token ? (
    <Outlet></Outlet>
  ) : (
    <Navigate to={"/login"} state={{ from: location }} replace />
  );
};

export default RequireAuth;
