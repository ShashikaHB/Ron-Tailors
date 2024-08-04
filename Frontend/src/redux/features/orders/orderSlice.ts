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
    removeOrderProducts: (state, action: PayloadAction<number>) => {},
    setCreatedProducts: (state, action: PayloadAction<number>) => {
      state.createdProducts.push(action.payload);
    },
    setSelectedRentItemId: (state, action: PayloadAction<number>) => {
      state.selectedRentItemId = action.payload;
    },
  },
});

export const selectOrderItems = (state: RootState) => state.orders.orderProducts;
export const selectedRentItemId = (state: RootState) => state.orders.selectedRentItemId;

export const { setOrderProducts, removeOrderProducts, setCreatedProducts, setSelectedRentItemId } = orderSlice.actions;

export default orderSlice.reducer;
