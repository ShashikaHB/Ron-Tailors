/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { Option } from '../types/common';
import { GetMaterial } from '../types/material';

const getAvailableMaterialOptions = (materials: GetMaterial[]): Option[] => {
  if (!materials || materials.length === 0) return [];
  const options = materials.map((material) => ({
    value: material.materialId,
    label: `${material.materialId} - ${material.brand}`,
  }));
  return [
    {
      value: '0',
      label: `Select a material`,
    },
    ...options,
  ];
};

export default getAvailableMaterialOptions;
