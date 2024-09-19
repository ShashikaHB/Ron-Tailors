/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { RiCloseLargeLine, RiCheckLine } from '@remixicon/react';
import { memo } from 'react';
import { useAppDispatch } from '../../../redux/reduxHooks/reduxHooks';
import { setProductId } from '../../../redux/features/common/commonSlice';

type ProductRendererProps = {
  data: any;
  handleOpenMeasurement: (id: number, isRent?: boolean) => void;
  handleRemove: (id: number) => void;
};

const ProductRenderer = ({ data, handleOpenMeasurement, handleRemove }: ProductRendererProps) => {
  const { description, products, selectedCategory } = data;

  const dispatch = useAppDispatch();

  return (
    <div>
      <div>
        <strong>{`${description} (${selectedCategory})`}</strong>
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
                {product.type === 'Rent Coat' || product.type === 'Rent West Coat' ? (
                  <button
                    type="button"
                    aria-label="close-btn"
                    className="icon-button"
                    onClick={() => {
                      handleOpenMeasurement(product.productId, true);
                      dispatch(setProductId(product.productId));
                    }}
                  >
                    R
                  </button>
                ) : (
                  <button
                    type="button"
                    aria-label="close-btn"
                    className="icon-button"
                    onClick={() => {
                      handleOpenMeasurement(product.productId);
                      dispatch(setProductId(product.productId));
                    }}
                  >
                    M
                  </button>
                )}
                {product.isMeasurementAvailable && product.type !== 'Rent Coat || Rent West Coat' && (
                  <div className="check-btn">
                    <RiCheckLine size={24} />
                  </div>
                )}
                <button
                  type="button"
                  aria-label="close-btn"
                  className="icon-button"
                  onClick={() => {
                    handleRemove(product.productId);
                  }}
                >
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
