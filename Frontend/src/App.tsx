import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "./router";

function App() {
  return (
    <>
      <Toaster position="top-right" richColors={true} duration={1000} />
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
