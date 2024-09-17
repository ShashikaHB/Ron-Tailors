/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { selectToken, selectUser } from '../../redux/features/auth/authSlice';
import { useAppSelector } from '../../redux/reduxHooks/reduxHooks';

const RequireAuth = () => {
  const token = useAppSelector(selectToken);
  const location = useLocation();

  const user = useAppSelector(selectUser);

  return token ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;
