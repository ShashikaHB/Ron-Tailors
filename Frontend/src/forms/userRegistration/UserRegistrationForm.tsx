import { SubmitHandler, useFormContext } from "react-hook-form";
import { UserRegistrationSchema } from "../formSchemas/userRegistrationSchema";
import RHFTextField from "../../components/customFormComponents/customTextField/RHFTextField.tsx";
import { Roles } from "../../enums/Roles";
import { Button, MenuItem, TextField } from "@mui/material";
import { useRegisterMutation } from "../../redux/features/auth/authApiSlice.ts";
import { useAppDispatch } from "../../redux/reduxHooks/reduxHooks.ts";
import { setCredentials } from "../../redux/features/auth/authSlice.ts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import RHFDropDown from "../../components/customFormComponents/customDropDown/RHFDropDown.tsx";

const roles = [
  {
    value: Roles.Admin,
    label: "Admin",
  },
  {
    value: Roles.SalesPerson,
    label: "Sales Person",
  },
  {
    value: Roles.Cutter,
    label: "Cutter",
  },
  {
    value: Roles.Tailor,
    label: "Tailor",
  },
];

const UserRegistrationForm = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useFormContext<UserRegistrationSchema>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [registerUser] = useRegisterMutation();

  const onSubmit: SubmitHandler<UserRegistrationSchema> = async (data) => {
    try {
      const userData = await registerUser(data).unwrap();
      dispatch(setCredentials({ ...userData }));
      navigate("/secured/dashboard");
      reset();
      toast.success(userData.message);
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="inputGroup gap-4 d-flex flex-column mt-4">
          <RHFTextField<UserRegistrationSchema>
            label="Name"
            name="name"
          ></RHFTextField>
          <RHFTextField<UserRegistrationSchema>
            label="Mobile"
            name="mobile"
          ></RHFTextField>
          <RHFTextField<UserRegistrationSchema>
            label="Password"
            name="password"
          ></RHFTextField>
          <RHFTextField<UserRegistrationSchema>
            label="Confirm Password"
            name="confirmPassword"
          ></RHFTextField>
          <RHFDropDown<UserRegistrationSchema>
            label="Role"
            name="role"
            options={roles}
          />
        </div>
        <div className="w-100 mt-3">
          <button className="primary-button w-100">
            Sign Up
          </button>
        </div>
      </form>
    </>
  );
};

export default UserRegistrationForm;
