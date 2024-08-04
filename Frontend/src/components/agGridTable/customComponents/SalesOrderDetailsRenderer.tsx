/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { ICellRendererParams } from 'ag-grid-community';

const SalesOrderDetailsRenderer = (props: ICellRendererParams) => {
  const { orderDetails } = props?.data ?? '';
  return (
    <div>
      {orderDetails?.map((order: any, index: number) => {
        const { products, description } = order;
        return (
          <div key={index}>
            <div>Description: {description}</div>
            {products?.map((product: any) => {
              const { productId, status, type } = product;
              return (
                <div className="d-flex gap-2 mx-3" key={productId}>
                  <p>{type}</p>
                  <p>{status}</p>
                </div>
              );
            })}
            {index !== orderDetails.length - 1 && <div style={{ borderTop: '1.25px solid black', margin: '10px 0' }} />}
          </div>
        );
      })}
    </div>
  );
};

export default SalesOrderDetailsRenderer;
