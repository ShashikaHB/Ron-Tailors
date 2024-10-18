/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { ICellRendererParams } from 'ag-grid-community';

const CustomerRenderer = (params: ICellRendererParams) => {
  const { name, mobile, secondaryMobile, otherMobile } = params?.data?.customer ?? '';
  return (
    <div>
      <p className="font-weight-bold">Name: {name}</p>
      <p>Mobile: {mobile}</p>
      {secondaryMobile && <p>Secondary Mobile: {secondaryMobile}</p>}
      {otherMobile && <p>Other Mobile: {otherMobile}</p>}
    </div>
  );
};

export default CustomerRenderer;
