import { z } from "zod";
import { customerSchema, defaultCustomerValues } from "./customerSchema";
import { ProductType } from "../../enums/ProductType";

export const measurementSchema = z.intersection(
  z.object({
    // customer: z.number(),
    style: z.string().optional(),
    remarks: z.string().optional(),
    isNecessary: z.boolean().default(false),
    estimatedReleaseDate: z.date(),
    itemType: z.nativeEnum(ProductType),
    measurements: z.array(z.string()).min(1, "Measurements required."),
  }),
  z.discriminatedUnion("variant", [
    z.object({ variant: z.literal("create") }),
    z.object({ variant: z.literal("edit"), measurementId: z.number().min(1) }),
  ])
);

export type MeasurementSchema = z.infer<typeof measurementSchema>;

export const defaultMeasurementValues: MeasurementSchema = {
  variant: "create",
  //   customer: 0,
  style: "",
  remarks: "",
  isNecessary: false,
  estimatedReleaseDate: new Date(),
  itemType: ProductType.Coat,
  measurements: Array(10).fill(""),
};
