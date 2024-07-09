import z from "zod";
import { Roles } from "../../enums/Roles";

export const userSchema = z.intersection(
  z.object({
    name: z.string().min(1, "Customer name is required."),
    mobile: z.string().refine((value) => /^\d{10}$/.test(value), {
      message: "Mobile number should be exactly 10 digits",
    }),
    role: z.nativeEnum(Roles).default(Roles.SalesPerson),
    isActive: z.boolean().optional(),
  }),
  z.discriminatedUnion("variant", [
    z.object({ variant: z.literal("create") }),
    z.object({ variant: z.literal("edit"), userId: z.number().min(1) }),
  ])
);

export type UserSchema = z.infer<typeof userSchema>;

export const defaultUserValues: UserSchema = {
  variant: "create",
  mobile: "",
  name: "",
  role: Roles.SalesPerson,
  isActive: false,
};
