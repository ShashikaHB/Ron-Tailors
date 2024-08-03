/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import ProductType from '../../../enums/ProductType';
import { Product } from '../../../types/products';
import { MaterialNeededforProduct } from '../../../types/material';

const initialState: Product = {
  type: ProductType.Coat,
  materials: [],
  selectedProduct: 0,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProductType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    removeProductType: (state) => {
      state.type = ProductType.Coat;
    },
    setMaterials: (state, action: PayloadAction<MaterialNeededforProduct>) => {
      state.materials.push(action.payload);
    },
    setSelectedProduct: (state, action: PayloadAction<number>) => {
      state.selectedProduct = action.payload;
    },
    removeSelectedProduct: (state) => {
      state.selectedProduct = 0;
    },
    removeMaterials: (state, action: PayloadAction<number>) => {
      state.materials = state.materials.filter((material) => material.material !== action.payload);
    },
    resetMaterials: (state) => {
      state.materials = initialState.materials;
    },
  },
});

export const selectType = (state: RootState) => state.product.type;
export const selectMaterial = (state: RootState) => state.product.materials;
export const selectSelectedProduct = (state: RootState) => state.product.selectedProduct;

export const { setProductType, removeProductType, setMaterials, removeMaterials, resetMaterials, setSelectedProduct, removeSelectedProduct } =
  productSlice.actions;

export default productSlice.reducer;
