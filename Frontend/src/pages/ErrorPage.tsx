/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>OOPS Error</h1>
      <button type="button" onClick={() => navigate('/dashboard')}>
        Back To Home
      </button>
    </div>
  );
};

export default ErrorPage;
