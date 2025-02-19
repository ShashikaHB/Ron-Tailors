/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import Stores from '../enums/Stores';

export type Material = {
  materialId: string;
  color: string;
  unitPrice: number;
  unitCost: number;
  noOfUnits: number;
  brand: string;
  name: string;
  store: Stores;
};

export type CreateMaterial = {
  variant: 'create';
};

export type EditMaterial = {
  variant: 'edit';
};

export type GetMaterial = Material & EditMaterial;

export type MaterialTableScheme = GetMaterial & { action: string };

export type MaterialNeededforProduct = {
  material: string;
  unitsNeeded: number;
};
