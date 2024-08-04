/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import PaymentType from '../enums/PaymentType';
import ProductType from '../enums/ProductType';
import { CreateCustomer, GetCustomer } from './customer';
import { RentOrder, RentOrderDetails } from './rentOrder';
import { User } from './user';

type OrderItem = {
  description: string;
  products: number[];
};

type OrderItems = { orderProducts: OrderItem[]; createdProducts: number[] };

export type SalesOrderDetails = {
  rentOrderId: number | null;
  color: string;
  size: number | undefined;
  description: string;
  handLength: string;
  notes: string;
  amount: number;
  type: ProductType;
};

export type SalesOrder = {
  orderDate: Date;
  deliveryDate: Date;
  weddingDate: Date;
  rentOrderDetails: RentOrderDetails[];
  fitOnRounds: Date[];
  totalPrice: number;
  subTotal: number;
  discount: number;
  advPayment: number;
  balance: number;
  paymentType: PaymentType;
};

export type CreateRentOrder = {
  variant: 'create';
  salesPerson: number;
  customer: CreateCustomer;
};

export type EditRentOrder = {
  variant: 'edit';
  customer: GetCustomer;
  SalesPerson: User;
  rentOrderId: number;
};

export type ApiCreateEditRentOrder = RentOrder & (CreateRentOrder | EditRentOrder);

export type ApiGetRentOrder = RentOrder & EditRentOrder;

export type RentOrderTableSchema = ApiGetRentOrder & { action: string };
