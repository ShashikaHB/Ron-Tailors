/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
type OrderItem = {
  description: string;
  products: number[];
};

type OrderItems = { orderProducts: OrderItem[]; createdProducts: number[] };
