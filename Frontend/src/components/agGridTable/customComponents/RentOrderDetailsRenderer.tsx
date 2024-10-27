/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { ICellRendererParams } from 'ag-grid-community';
import { RentItemDetails } from '../../../types/rentItem';

const RentOrderDetailsRenderer = (props: ICellRendererParams) => {
  const { rentOrderDetails } = props?.data ?? '';
  return (
    <div>
      {rentOrderDetails?.map((order: RentItemDetails, index: number) => {
        const { rentItemId, description, itemType, color, notes, status } = order;
        const statusStyle = {
          fontWeight: 'bold',
          color: status === 'Available' ? 'green' : 'red',
        };
        return (
          <div key={index}>
            <div className="d-flex gap-2">
              <p> {rentItemId}&nbsp; |</p>
              <p style={statusStyle}>{status}</p>
            </div>
            <div className="d-flex gap-2 font-weight-bold">
              <p className="rent-item-detail">{description}</p>
              <p className="rent-item-detail">Color:&nbsp;{color}</p>
            </div>
            <p className="rent-item-detail pb-2">
              Notes:&nbsp;
              {notes}
            </p>
            {index !== rentOrderDetails.length - 1 && <div style={{ borderTop: '1.25px solid black', margin: '10px 0' }} />}
          </div>
        );
      })}
    </div>
  );
};

export default RentOrderDetailsRenderer;
