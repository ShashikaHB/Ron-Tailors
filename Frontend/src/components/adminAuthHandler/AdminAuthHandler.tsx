/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { ReactNode } from 'react';
import { selectUser } from '../../redux/features/auth/authSlice';
import { useAppSelector } from '../../redux/reduxHooks/reduxHooks';

type RequireAdminAuthProps = {
  children?: ReactNode;
};

const RequireAdminAuth = ({ children }: RequireAdminAuthProps) => {
  const user = useAppSelector(selectUser);
  const location = useLocation();

  // Check if the user role is 'Admin'
  if (user?.role !== 'Admin') {
    // Redirect to a "not authorized" page or any default page
    return <Navigate to="/secured/dashboard" state={{ from: location }} replace />;
  }

  return children || <Outlet />;
};

export default RequireAdminAuth;
