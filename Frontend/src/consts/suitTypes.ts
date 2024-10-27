/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { SuitTypes } from '../enums/RentOrderTypes';

const suitTypeOptions = [
  {
    value: '',
    label: 'Select a Store',
  },
  {
    value: SuitTypes.Wedding,
    label: 'Wedding',
  },
  {
    value: SuitTypes.Normal,
    label: 'Normal',
  },
];

export default suitTypeOptions;
