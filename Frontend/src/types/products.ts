/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { MaterialNeededforProduct } from './material';

export type Product = {
  type: string;
  materials: MaterialNeededforProduct[];
  selectedProduct: number;
};

export type ProductOptions = {
  id: string;
  label: string;
  checked: boolean;
};
