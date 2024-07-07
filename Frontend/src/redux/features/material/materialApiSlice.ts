import { GetMaterial, Material } from "../../../types/material";
import { apiSlice } from "../../api/apiSlice";
import { ApiResponse } from "../../../types/common";
import { toast } from "sonner";
import { omit } from "lodash";
import { MaterialSchema } from "../../../forms/formSchemas/materialsSchema";

export const materialApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addNewMaterial: builder.mutation<ApiResponse<String>, MaterialSchema>({
      query: (newMaterial) => ({
        url: "/material",
        method: "POST",
        body: { ...newMaterial },
      }),
      invalidatesTags: ["Materials"],
    }),
    getAllMaterials: builder.query<Material[], void>({
      query: () => ({
        url: "/material",
        method: "GET",
      }),
      providesTags: ["Materials"],
      transformResponse: (res: ApiResponse<Material[]>): Material[] => {
        if (!res.success) {
          toast.error("Material data fetching failed!");
        }
        return res.data;
      },
    }),
    getSingleMaterial: builder.query<GetMaterial, Number>({
      query: (id: Number) => ({
        url: `/material/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, args) =>
        result ? [{ type: "Materials", id: args?.toString() }] : [],
      transformResponse: (res: ApiResponse<GetMaterial>): any => {
        if (!res.success) {
          toast.error("Material data fetching failed!");
        }
        return { ...res.data, variant: "edit" };
      },
    }),
    updateSingleMaterial: builder.mutation<ApiResponse<String>, MaterialSchema>(
      {
        query: (material: MaterialSchema) => {
          if (material.variant === "edit") {
            const materialData = omit(material, ["variant", "materialId"]);
            return {
              url: `/material/${material.materialId}`,
              method: "PATCH",
              body: materialData,
            };
          } else {
            throw new Error("Unsupported variant type for update.");
          }
        },
        invalidatesTags: (result, error, args) => [
          {
            type: "Materials",
            id:
              args?.variant === "edit" ? args.materialId.toString() : "unknown",
          },
          { type: "Materials" },
        ],
      }
    ),
  }),
});

export const {
  useGetAllMaterialsQuery,
  useAddNewMaterialMutation,
  useGetSingleMaterialQuery,
  useUpdateSingleMaterialMutation,
} = materialApiSlice;
