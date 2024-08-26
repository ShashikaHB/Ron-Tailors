/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';

const initialState: any = {
  orderProducts: [],
  createdProducts: [],
  selectedRentItemId: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrderProducts: (state, action: PayloadAction<string>) => {
      state.orderProducts.push({
        description: action.payload,
        products: state.createdProducts,
      });
      state.createdProducts = [];
    },
    setOrderProductsBulk: (state, action: PayloadAction<any>) => {
      state.orderProducts = action.payload;
    },
    removeOrderProducts: (state, action: PayloadAction<number>) => {
      state.orderProducts = state.orderProducts
        .map((row: any) => {
          const filteredProducts = row.products.filter((product: any) => product !== action.payload);
          return { ...row, products: filteredProducts };
        })
        .filter((row: any) => row.products.length > 0);
    },
    setCreatedProducts: (state, action: PayloadAction<number>) => {
      state.createdProducts.push(action.payload);
    },
    setSelectedRentItemId: (state, action: PayloadAction<number>) => {
      state.selectedRentItemId = action.payload;
    },
    resetOderProducts: (state) => {
      state.orderProducts = [];
    },
  },
});

export const selectOrderItems = (state: RootState) => state.orders.orderProducts;
export const selectedRentItemId = (state: RootState) => state.orders.selectedRentItemId;

export const { setOrderProducts, removeOrderProducts, setCreatedProducts, setSelectedRentItemId, resetOderProducts, setOrderProductsBulk } = orderSlice.actions;

export default orderSlice.reducer;
