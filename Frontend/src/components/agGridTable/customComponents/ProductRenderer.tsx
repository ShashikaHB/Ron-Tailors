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

type ProductRendererProps = {
  data: any;
  handleOpenMeasurement: (id: number, isRent?: boolean) => void;
  handleOpenRentOrder: (id: string) => void;
  handleRemove: (id: number) => void;
  handlePrintRentItem: (id: string) => void;
};

const ProductRenderer = ({ data, handleOpenMeasurement, handleRemove, handleOpenRentOrder, handlePrintRentItem }: ProductRendererProps) => {
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
              <span style={{ marginRight: '10px' }}>{product.itemType}</span>
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
              <span style={{ marginRight: '10px' }}>{product.itemType}</span>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  aria-label="close-btn"
                  className="icon-button"
                  onClick={() => {
                    handleOpenRentOrder(product.rentItemId);
                  }}
                >
                  R
                </button>
                {product.description && (
                  <div className="check-btn">
                    <button type="button" aria-label="close-btn" className="icon-button" onClick={() => handlePrintRentItem(product.rentItemId)}>
                      P
                    </button>
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
