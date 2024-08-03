/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
export type Material = {
  name: string;
  color: string;
  unitPrice: number;
  noOfUnits: number;
  marginPercentage: number;
  brand: string;
  type?: string;
};

export type CreateMaterial = {
  variant: 'create';
};

export type EditMaterial = {
  variant: 'edit';
  materialId: number;
};

export type GetMaterial = Material & EditMaterial;

export type MaterialTableScheme = GetMaterial & { action: string };

export type MaterialNeededforProduct = {
  material: number;
  unitsNeeded: number;
};
