/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import PaymentType from '../enums/PaymentType';

const paymentOptions = [
  {
    value: PaymentType.Cash,
    label: 'Cash',
  },
  {
    value: PaymentType.Card,
    label: 'Card',
  },
  {
    value: PaymentType.Bank,
    label: 'Bank Transfer',
  },
];

export default paymentOptions;
