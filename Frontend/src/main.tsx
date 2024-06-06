import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/main.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import RootLayout from "./pageLayouts/RootLayout.tsx";
import { Profile } from "./pages/Profile.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import SIgnInSignUpLayout from "./pageLayouts/SIgnInSignUpLayout.tsx";
import NewOrder from "./pages/NewOrder.tsx";
import ViewUnderConstruction from "./pages/ViewUnderConstruction.tsx";

const router = createBrowserRouter([
  {
    path: "/secured",
    element: <RootLayout />,
    errorElement: <div>404 NOT FOUND</div>,
    children: [
      {
        path: "",
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
        path: "sales",
        element: <Profile></Profile>,
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
        element: <ViewUnderConstruction></ViewUnderConstruction>,
      },
      {
        path: "users",
        element: <ViewUnderConstruction></ViewUnderConstruction>,
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
  {
    path: "/public",
    element: <SIgnInSignUpLayout />,
    errorElement: <div>404 NOT FOUND</div>,
    children: [
      { path: "signUp", element: <RegisterPage /> },
      { path: "signIn", element: <LoginPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
