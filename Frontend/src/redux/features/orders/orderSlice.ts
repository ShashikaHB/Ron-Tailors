import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";

const initialState: Order = {
  orderProducts: [{ description: "", products: [] }],
};

const orderSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setOrderProducts: (state, action: PayloadAction<Products>) => {},
    removeOrderProducts: (state, action: PayloadAction<Number>) => {},
  },
});

export const selectUser = (state: RootState) => state.order.orderProducts;

export const { setOrderProducts, removeOrderProducts } = orderSlice.actions;

export default orderSlice.reducer;
