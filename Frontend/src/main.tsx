import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/main.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import RootLayout from "./pageLayouts/RootLayout.tsx";
import { Profile } from "./pages/Profile.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <div>404 NOT FOUND</div>,
    children:[
        {
            path:'',
            element:<LandingPage></LandingPage>
        },
        {
            path:'profile',
            element:<Profile></Profile>
        },
        {
            path:'orderBook',
            element:<LandingPage></LandingPage>
        },
        {
            path:'sales',
            element:<Profile></Profile>
        }
    ]
  },
  { 
    path: "/dashboard", 
    element: <LandingPage />,
    errorElement: <div>404 NOT FOUND</div>
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
