/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { memo } from 'react';
import { Button } from '@mui/material';

const ProductRenderer = ({ data, handleOpenMeasurement }) => {
  const { description, products } = data;

  return (
    <div>
      <div>
        <strong>{description}</strong>
      </div>
      <div>
        {products.map((product, index) => {
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '5px',
              }}
            >
              <span style={{ marginRight: '10px' }}>{product.type}</span>
              <Button variant="outlined" size="small" style={{ marginRight: '10px' }} onClick={() => handleOpenMeasurement(product.productId)}>
                M
              </Button>
              <span>${product.price}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(ProductRenderer);
