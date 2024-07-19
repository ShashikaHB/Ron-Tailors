import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";

const initialState: OrderItems = {
  orderProducts: [],
  createdProducts: [],
};

const orderSlice = createSlice({
  name: "orders",
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
  },
});

export const selectOrderItems = (state: RootState) =>
  state.orders.orderProducts;

export const { setOrderProducts, removeOrderProducts, setCreatedProducts } =
  orderSlice.actions;

export default orderSlice.reducer;
