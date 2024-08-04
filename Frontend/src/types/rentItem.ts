/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import ProductType from '../enums/ProductType';
import { RentItemStatus } from '../enums/RentItemDetails';

export type RentItemDetails = {
  rentItemId: number;
  color: string;
  size: number | undefined;
  description: string;
  handLength: string;
  notes: string;
  amount: number;
  type: ProductType;
};

export type RentItem = {
  color: string;
  size: number | undefined;
  type: ProductType;
  description: string;
};

export type CreateRentItem = {
  variant: 'create';
};

export type EditRentItem = {
  variant: 'edit';
  rentItemId: number;
  status: RentItemStatus;
};

export type ApiCreateEditRentItem = RentItem & (CreateRentItem | EditRentItem);

export type ApiGetRentItem = RentItem & EditRentItem;

export type RentItemTableSchema = ApiGetRentItem & { action: string };
