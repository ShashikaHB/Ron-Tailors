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
  isLoading: false,
  customerId: null,
  productId: null,
  measurementId: null,
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCustomerId: (state, action: PayloadAction<number>) => {
      state.customerId = action.payload;
    },
    removeCustomerId: (state) => {
      state.customerId = null;
    },
    setProductId: (state, action: PayloadAction<number>) => {
      state.productId = action.payload;
    },
    removeProductId: (state) => {
      state.productId = null;
    },
    // setRentItemId: (state, action: PayloadAction<number>) => {
    //   state.rentItemId = action.payload;
    // },
    // removeRentItemId: (state) => {
    //   state.rentItemId = null;
    // },
  },
});

export const loadingState = (state: RootState) => state.common.isLoading;
export const selectCustomerId = (state: RootState) => state.common.customerId;
export const selectProductId = (state: RootState) => state.common.productId;
// export const selectRentItemId = (state: RootState) => state.common.rentItemId;

export const { setLoading, setCustomerId, removeCustomerId, setProductId, removeProductId } = commonSlice.actions;

export default commonSlice.reducer;
