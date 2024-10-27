/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { RentItemDetails } from '../../../types/rentItem';

type RentItemDetailsRendererProps = {
  data: RentItemDetails;
};

const RentItemDetailsRenderer = ({ data }: RentItemDetailsRendererProps) => {
  const { description, color, size, handLength, notes, itemType } = data;
  return (
    <div>
      <div className="rent-item-detail">{`${itemType} : ${description}`}</div>
      <div className="rent-item-detail">{`Color: ${color}  |  Size: ${size}`}</div>
      <div className="rent-item-detail">{`HandLength: ${handLength}`}</div>
      <div className="rent-item-detail">{`Notes: ${notes}`}</div>
    </div>
  );
};

export default RentItemDetailsRenderer;
