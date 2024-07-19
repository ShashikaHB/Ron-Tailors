import { toast } from "sonner";
import { ProductSchema } from "../../../forms/formSchemas/productSchema";
import { ApiResponse } from "../../../types/common";
import { apiSlice } from "../../api/apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addNewProduct: builder.mutation<any, ProductSchema>({
      query: (newProduct) => ({
        url: "/product",
        method: "POST",
        body: { ...newProduct },
      }),
      transformResponse: (res: ApiResponse<any>): any => {
        if (!res.success) {
          toast.error("Product creation failed!");
        }
        return res.data.productId;
      },
      invalidatesTags: ["Products"],
    }),
    getAllProducts: builder.query({
      query: () => ({
        url: "/product",
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<any>) => {
        if (!res.success) {
          toast.error("Product fetching failed.");
        }
        return res.data;
      },
      providesTags: ["Products"],
    }),
    getSingleProduct: builder.query({
      query: (productId) => ({
        url: `/product/${productId}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<any>) => {
        if (!res.success) {
          toast.error("Product fetching failed.");
        }
        return res.data;
      },
      providesTags: ["Products"],
    }),
    updateSingleProduct: builder.mutation({
      query: (data) => ({
        url: `/measurement/${data.productId}`,
        method: "PATCH",
        body: { ...data.measurement },
      }),
      transformResponse: (res: ApiResponse<any>) => {
        if (!res.success) {
          toast.error("error while creating measurement");
        }
        toast.success("New measurement created.");
        return res.data;
      },
    }),
  }),
});

export const {
  useAddNewProductMutation,
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useUpdateSingleProductMutation,
} = productApiSlice;
