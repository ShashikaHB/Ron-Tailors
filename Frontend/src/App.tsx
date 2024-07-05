import {
  BrowserRouter,
  createBrowserRouter,
  Navigate,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import RootLayout from "./pageLayouts/RootLayout.tsx";
import { Profile } from "./pages/Profile.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import SIgnInSignUpLayout from "./pageLayouts/SIgnInSignUpLayout.tsx";
import NewOrder from "./pages/NewOrder.tsx";
import ViewUnderConstruction from "./pages/ViewUnderConstruction.tsx";
import SalesOrderPage from "./pages/SalesOrderPage.tsx";
import StockPage from "./pages/StockPage.tsx";
import UsersPage from "./pages/UsersPage.tsx";
import RequireAuth from "./components/authHandlerComponent/RequireAuth.tsx";

import { router } from "./router";

function App() {
  // const router = createBrowserRouter([
  //   {
  //     path: "/secured",
  //     element: <RootLayout />,
  //     errorElement: <div>404 NOT FOUND</div>,
  //     children: [
  //       {
  //         path: "",
  //         element: <LandingPage></LandingPage>,
  //       },
  //       {
  //         path: "profile",
  //         element: <Profile></Profile>,
  //       },
  //       {
  //         path: "orderBook",
  //         element: <LandingPage></LandingPage>,
  //       },
  //       {
  //         path: "sales",
  //         element: <SalesOrderPage></SalesOrderPage>,
  //       },
  //       {
  //         path: "newOrder",
  //         element: <NewOrder></NewOrder>,
  //       },
  //       {
  //         path: "payments",
  //         element: <ViewUnderConstruction></ViewUnderConstruction>,
  //       },
  //       {
  //         path: "stock",
  //         element: <StockPage></StockPage>,
  //       },
  //       {
  //         path: "users",
  //         element: <UsersPage></UsersPage>,
  //       },
  //       {
  //         path: "cashBook",
  //         element: <ViewUnderConstruction></ViewUnderConstruction>,
  //       },
  //       {
  //         path: "Reports",
  //         element: <ViewUnderConstruction></ViewUnderConstruction>,
  //       },
  //     ],
  //   },
  //   {
  //     path: "/public",
  //     element: <SIgnInSignUpLayout />,
  //     errorElement: <div>404 NOT FOUND</div>,
  //     children: [
  //       { path: "signUp", element: <RegisterPage /> },
  //       { path: "signIn", element: <LoginPage /> },
  //     ],
  //   },
  //   {
  //     path: "*",
  //     element: <Navigate to="/public/signIn" replace />,
  //   },

  return (
    <RouterProvider router={router}></RouterProvider>
    // <Routes>
    //   <Route path="/" element={<SIgnInSignUpLayout />}>
    //     {/* Public routes */}
    //     <Route path="login" element={<LoginPage />}></Route>
    //     <Route path="register" element={<RegisterPage />}></Route>
    //   </Route>

    //   <Route path="/secured" element={<RootLayout />}>
    //     <Route element={<RequireAuth />}>
    //       {/* Secured routes */}
    //       <Route path="dashboard" element={<LandingPage />}></Route>
    //       <Route path="profile" element={<Profile />}></Route>
    //     </Route>
    //   </Route>
    // </Routes>
  );
}

export default App;
