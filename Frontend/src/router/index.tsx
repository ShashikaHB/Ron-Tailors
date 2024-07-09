import { Navigate, createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import SIgnInSignUpLayout from "../pageLayouts/SIgnInSignUpLayout";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import RootLayout from "../pageLayouts/RootLayout";
import LandingPage from "../pages/LandingPage";
import { Profile } from "../pages/Profile";
import SalesOrderPage from "../pages/SalesOrderPage";
import NewOrder from "../pages/NewOrder";
import ViewUnderConstruction from "../pages/ViewUnderConstruction";
import StockPage from "../pages/StockPage";
import UsersPage from "../pages/UsersPage";
import RequireAuth from "../components/authHandlerComponent/RequireAuth";
import NewSalesOrder from "../pages/NewSalesOrder";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SIgnInSignUpLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Navigate to="/login" replace /> },
      { path: "register", element: <RegisterPage /> },
      { path: "login", element: <LoginPage /> },
    ],
  },
  {
    path: "/secured",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          {
            path: "dashboard",
            element: <LandingPage></LandingPage>,
          },
          {
            path: "profile",
            element: <Profile></Profile>,
          },
          {
            path: "orderBook",
            element: <LandingPage></LandingPage>,
          },
          {
            element: <SalesOrderPage></SalesOrderPage>,
            path: "sales",
          },
          {
            element: <NewSalesOrder></NewSalesOrder>,
            path: "addSalesOrder",
          },
          {
            path: "newOrder",
            element: <NewOrder></NewOrder>,
          },
          {
            path: "payments",
            element: <ViewUnderConstruction></ViewUnderConstruction>,
          },
          {
            path: "stock",
            element: <StockPage></StockPage>,
          },
          {
            path: "users",
            element: <UsersPage></UsersPage>,
          },
          {
            path: "cashBook",
            element: <ViewUnderConstruction></ViewUnderConstruction>,
          },
          {
            path: "Reports",
            element: <ViewUnderConstruction></ViewUnderConstruction>,
          },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/secured/dashboard" replace /> },
]);
