import { toast } from "sonner";
import { ApiResponse } from "../../../types/common";
import { apiSlice } from "../../api/apiSlice";

export const measurementApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMeasurement: builder.mutation({
      query: (measurementData) => ({
        url: "/measurement/",
        method: "POST",
        body: { ...measurementData },
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

export const { useCreateMeasurementMutation } = measurementApiSlice;