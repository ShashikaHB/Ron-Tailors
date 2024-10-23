/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import ProductType from '../enums/ProductType';

const measurementBtnMapping = [
  {
    product: ProductType.Coat,
    buttons: [
      ['SB', 'DB', 'Hinec'],
      ['1 TB', '2 TB', '3 TB'],
      ['Normal', 'Half Satting', 'Full Satting'],
    ],
  },
  {
    product: ProductType.Shirt,
    buttons: [['Tunic Coller', 'Normal Shirt', 'Dress Shirt'], ['Black Buttons']],
  },
  {
    product: ProductType.Trouser,
    buttons: [
      ['SP', 'EP'],
      ['NOPL', '2 PL'],
      ['1 Hip = 1/4', '2 Hip = 1/4', '1 Hiptab', '2 Hiptab', '2 Hip Kasa + Button', '1 Hip Kasa + Button'],
      ['Top Band', 'Clip + Button'],
    ],
  },
  {
    product: ProductType.WestCoat,
    buttons: [
      ['Curve', 'V Shape', 'Lepal West Coat'],
      ['Cross', 'Normal'],
      ['Buttons 6', 'Buttons 8'],
    ],
  },
  {
    product: ProductType.NationalCoat,
    buttons: [
      ['Tunic coller', 'Coller Button', 'Coller Cut'],
      ['Half Open', 'Side Open', 'Full Open'],
    ],
  },
  {
    product: ProductType.NationalCoat,
    buttons: [
      ['Tunic coller', 'Coller Button', 'Coller Cut'],
      ['Half Open', 'Side Open', 'Full Open'],
    ],
  },
];

export default measurementBtnMapping;
