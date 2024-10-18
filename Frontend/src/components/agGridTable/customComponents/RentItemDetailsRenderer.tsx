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
  const { description, color, size, handLength, notes, itemType, suitType } = data;
  return (
    <div>
      <div>{`${itemType} : ${description}`}</div>
      <div>{`Color: ${color}  |  Size: ${size}`}</div>
      <div>{`HandLength: ${handLength}`}</div>
      <div>{`Notes: ${notes}`}</div>
      <div>{`SuitType: ${suitType}`}</div>
    </div>
  );
};

export default RentItemDetailsRenderer;
