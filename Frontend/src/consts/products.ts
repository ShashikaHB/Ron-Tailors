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
import ProductType, { ProductCategory } from '../enums/ProductType';

export const productCategoryItemMap = [
  {
    category: ProductCategory.FullSuit,
    items: [
      ProductType.Coat,
      ProductType.Shirt,
      ProductType.Trouser,
      ProductType.WestCoat,
      ProductType.Cravat,
      ProductType.Bow,
      ProductType.Tie,
      ProductType.Hanky,
    ],
  },
  {
    category: ProductCategory.NationalSuit,
    items: [ProductType.NationalCoat, ProductType.NationalShirt, ProductType.Sarong, ProductType.Trouser, ProductType.Hanky],
  },
  {
    category: ProductCategory.RentFullSuit,
    items: [
      ProductType.RentCoat,
      ProductType.Shirt,
      ProductType.Trouser,
      ProductType.RentWestCoat,
      ProductType.Cravat,
      ProductType.Bow,
      ProductType.Tie,
      ProductType.Hanky,
    ],
  },
  {
    category: ProductCategory.General,
    items: [
      ProductType.Coat,
      ProductType.NationalCoat,
      ProductType.WestCoat,
      ProductType.Shirt,
      ProductType.Trouser,
      ProductType.DesignedTrouser,
      ProductType.DesignedShirt,
      ProductType.NationalShirt,
      //   ProductType.RentCoat,
      //   ProductType.RentWestCoat,
      ProductType.Sarong,
      ProductType.Tie,
      ProductType.Bow,
      ProductType.Cravat,
      ProductType.Hanky,
      ProductType.Chain,
    ],
  },
];

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

export const readyMadeItems = [
  {
    value: '',
    label: `Select a product`,
  },
  {
    value: ProductType.Bow,
    label: 'Bow',
  },
  {
    value: ProductType.Belt,
    label: 'Belt',
  },
  {
    value: ProductType.Tie,
    label: 'Tie',
  },
  {
    value: ProductType.Hanky,
    label: 'Hanky',
  },
  {
    value: ProductType.Coat,
    label: 'Coat',
  },
  {
    value: ProductType.Trouser,
    label: 'Trouser',
  },
  {
    value: ProductType.Shirt,
    label: 'Shirt',
  },
];

export const statusOptions = ['Not Started', 'Cutting Done', 'Tailoring Started', 'Tailoring Done'];
