/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { SuitTypes } from '../enums/RentOrderTypes';
import StakeOptions from '../enums/StakeOptions';

export const suitSelectOptions = [
  {
    value: '',
    label: 'Select a SuitType',
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

export const stakeOptions = [
  {
    value: StakeOptions.No,
    label: 'Select a stake option',
  },
  {
    value: StakeOptions.NIC,
    label: 'NIC',
  },
  {
    value: StakeOptions.Deposit,
    label: 'Deposit',
  },
];
