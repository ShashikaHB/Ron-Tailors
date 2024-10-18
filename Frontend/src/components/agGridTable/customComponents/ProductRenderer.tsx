/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { RiCheckLine } from '@remixicon/react';
import { memo } from 'react';
import { useAppDispatch } from '../../../redux/reduxHooks/reduxHooks';
import { setProductId } from '../../../redux/features/common/commonSlice';
import { setSelectedRentItemId } from '../../../redux/features/orders/orderSlice';

type ProductRendererProps = {
  data: any;
  handleOpenMeasurement: (id: number, isRent?: boolean) => void;
  handleRemove: (id: number) => void;
};

const ProductRenderer = ({ data, handleOpenMeasurement, handleRemove }: ProductRendererProps) => {
  const { description, products, category, rentItems } = data;

  const dispatch = useAppDispatch();

  return (
    <div>
      <div>
        <strong>{`${description} (${category})`}</strong>
      </div>
      <div>
        {products?.map((product: any, index: any) => {
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
              <span style={{ marginRight: '10px' }}>{product.productType}</span>
              <div className="d-flex gap-2">
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

                {product.isMeasurementAvailable && (
                  <div className="check-btn">
                    <RiCheckLine size={24} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {rentItems?.map((product: any, index: any) => {
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
              <span style={{ marginRight: '10px' }}>{product.productType || product.itemType}</span>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  aria-label="close-btn"
                  className="icon-button"
                  onClick={() => {
                    handleOpenMeasurement(product.rentItemId, true);
                    dispatch(setSelectedRentItemId(product.rentItemId));
                  }}
                >
                  R
                </button>
                {product.description && (
                  <div className="check-btn">
                    <RiCheckLine size={24} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(ProductRenderer);
