/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import router from './router';

const App = () => {
  return (
    <>
      <Toaster position="top-right" richColors duration={1500} />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
