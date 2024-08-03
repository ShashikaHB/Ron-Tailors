/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { RentItemDetails } from '../../../types/rentOrder';

type RentItemDetailsRendererProps = {
  data: RentItemDetails;
};

const RentItemDetailsRenderer = ({ data }: RentItemDetailsRendererProps) => {
  const { description, color, size, handLength, notes } = data;
  return (
    <div>
      <div>{description}</div>
      <div>
        {color} | {size} | {handLength}
      </div>
      <div>{notes}</div>
    </div>
  );
};

export default RentItemDetailsRenderer;
