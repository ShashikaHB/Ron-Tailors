/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
/* eslint-disable import/prefer-default-export */

/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import ProductType from '../enums/ProductType';

export const initialProductOptions = [
  {
    id: ProductType.Shirt,
    label: 'Shirt',
    checked: false,
  },
  {
    id: ProductType.Coat,
    label: 'Coat',
    checked: false,
  },
  {
    id: ProductType.Trouser,
    label: 'Trouser',
    checked: false,
  },
  {
    id: ProductType.WestCoat,
    label: 'West Coat',
    checked: false,
  },
  {
    id: ProductType.Cravat,
    label: 'Cravat',
    checked: false,
  },
  {
    id: ProductType.Bow,
    label: 'Bow',
    checked: false,
  },
  {
    id: ProductType.Tie,
    label: 'Tie',
    checked: false,
  },
];

export const statusOptions = ['Not Started', 'Cutting Started', 'Cutting Done', 'Tailoring Started', 'Tailoring Done'];
