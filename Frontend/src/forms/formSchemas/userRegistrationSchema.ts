import z from "zod";
import { Roles } from "../../enums/Roles";

const rolesSchema = Object.values(Roles) as [string, ...string[]];

export const userRegistrationSchema = z
  .object({
    name: z.string().min(3, "User name is required."),
    mobile: z.string().refine((value) => /^\d{10}$/.test(value), {
      message: "Mobile number should be exactly 10 digits",
    }),
    role: z.enum(rolesSchema, { message: "Role is required" }),
    password: z.string().min(3, "Password is required."),
    confirmPassword: z.string().min(1, "Confirm Password is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type UserRegistrationSchema = z.infer<typeof userRegistrationSchema>;

export const defaultUserValues: UserRegistrationSchema = {
  name: "",
  mobile: "",
  role: Roles.SalesPerson, // Default role set to "Admin"
  password: "",
  confirmPassword: "",
};
