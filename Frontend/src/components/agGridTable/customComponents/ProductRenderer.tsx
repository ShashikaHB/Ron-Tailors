/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { RiCloseLargeLine } from '@remixicon/react';
import { memo } from 'react';

type ProductRendererProps = {
  data: any;
  handleOpenMeasurement: (id: number) => void;
  handleRemove: (id: number) => void;
};

const ProductRenderer = ({ data, handleOpenMeasurement, handleRemove }: ProductRendererProps) => {
  const { description, products } = data;

  return (
    <div>
      <div>
        <strong>{description}</strong>
      </div>
      <div>
        {products.map((product: any, index: any) => {
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '5px',
              }}
              className="d-flex gap-4"
            >
              <span style={{ marginRight: '10px' }}>{product.type}</span>
              <span>Rs.{product.price}</span>
              <div className="d-flex gap-2">
                <button type="button" aria-label="close-btn" className="icon-button" onClick={() => handleOpenMeasurement(product.productId)}>
                  M
                </button>
                <button type="button" aria-label="close-btn" className="icon-button" onClick={() => handleRemove(product.productId)}>
                  <RiCloseLargeLine size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(ProductRenderer);
