/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { Navigate, createBrowserRouter } from 'react-router-dom';
import ErrorPage from '../pages/ErrorPage';
import SignInSignUpLayout from '../pageLayouts/SignInSignUpLayout';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import RootLayout from '../pageLayouts/RootLayout';
import LandingPage from '../pages/LandingPage';
import { Profile } from '../pages/Profile';
import NewOrder from '../pages/NewOrder';
import ViewUnderConstruction from '../pages/ViewUnderConstruction';
import StockPage from '../pages/StockPage';
import UsersPage from '../pages/UsersPage';
import RequireAuth from '../components/authHandlerComponent/RequireAuth';
import NewSalesOrder from '../pages/NewSalesOrder';
import NewRentOutOrder from '../pages/NewRentOutOrder';
import NewRentReturn from '../pages/NewRentReturn';
import AddRentItem from '../pages/AddRentItem';
import RentBook from '../pages/RentBook';
import SalesOrderBook from '../pages/SalesOrderBook';
import Salary from '../pages/Salary';
import CashBook from '../pages/CashBook';
import PiecePrices from '../pages/PiecePrices';
import NewReadyMadeOrder from '../pages/NewReadyMadeOrder';
import AccountsPage from '../pages/AccountsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SignInSignUpLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Navigate to="/login" replace /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'login', element: <LoginPage /> },
    ],
  },
  {
    path: '/secured',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          {
            path: 'dashboard',
            element: <LandingPage />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'rentBook',
            element: <RentBook />,
          },
          {
            path: 'salesOrderBook',
            element: <SalesOrderBook />,
          },
          {
            path: 'addSalesOrder/:salesOrderId?',
            element: <NewSalesOrder />,
          },
          {
            path: 'addRentOrder/:rentOrderId?',
            element: <NewRentOutOrder />,
          },
          {
            path: 'addRentItem',
            element: <AddRentItem />,
          },
          {
            path: 'editSalary',
            element: <Salary />,
          },
          {
            path: 'editPiecePrices',
            element: <PiecePrices />,
          },
          {
            path: 'rentReturn',
            element: <NewRentReturn />,
          },
          {
            path: 'newOrder',
            element: <NewOrder />,
          },
          {
            path: 'newReadyMadeOrder',
            element: <NewReadyMadeOrder />,
          },
          {
            path: 'stock',
            element: <StockPage />,
          },
          {
            path: 'users',
            element: <UsersPage />,
          },
          {
            path: 'payments',
            element: <ViewUnderConstruction />,
          },
          {
            path: 'cashBook',
            element: <CashBook />,
          },
          {
            path: 'accounts',
            element: <AccountsPage />,
          },
          {
            path: 'Reports',
            element: <ViewUnderConstruction />,
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/secured/dashboard" replace /> },
]);

export default router;
