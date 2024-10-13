/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';
import SideNav from '../components/sideNav/SideNav';
import { useAppSelector } from '../redux/reduxHooks/reduxHooks';
import { loadingState } from '../redux/features/common/commonSlice';

const RootLayout = () => {
  const isLoading = useAppSelector(loadingState);

  return (
    <div className="d-flex flex-grow-1">
      <div className="d-flex flex-column h-100 w-100">
        <Header />
        <div className="row flex-grow-1 overflow-hidden mx-0">
          <div className="col-12 col-12 flex-grow-1 overflow-hidden d-flex flex-column h-100">
            <div className="row h-100 flex-grow-1 overflow-hidden d-flex flex-column h-100">
              <div className="col-2 flex-grow-1 overflow-hidden d-flex flex-column h-100 py-3">
                <SideNav />
              </div>
              <div className="col-10 flex-grow-1 overflow-hidden d-flex flex-column h-100 main-body-container py-3">
                <div className="container-fluid h-100 overflow-y-auto ">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="backdrop">
          <div className="loading-image" />
          Loading...
        </div>
      )}
    </div>
  );
};

export default RootLayout;
