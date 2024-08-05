/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { Outlet } from 'react-router-dom';
import LoginLogo from '../assets/images/logo-login.png';

const SignInSignUpLayout = () => (
  <div className="login-container">
    <div className="row login-background">
      <div className="col-6 d-flex justify-content-center">
        <img className="login-logo" src={LoginLogo} alt="react logo" />
      </div>
      <div className="col-6">
        <div className="login-body">
          <div className='h-100'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SignInSignUpLayout;
