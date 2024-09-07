/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div>
      404 NOT FOUND
      <Link to="/"> Home</Link>
    </div>
  );
};

export default NotFoundPage;
