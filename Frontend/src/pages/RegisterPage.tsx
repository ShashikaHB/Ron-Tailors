import { Link, useNavigate } from "react-router-dom";
import UserRegistrationForm from "../forms/userRegistration/UserRegistrationForm.tsx";
import { FormProvider, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import {
  UserRegistrationSchema,
  defaultUserRegValues,
  userRegistrationSchema,
} from "../forms/formSchemas/userRegistrationSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";

const RegisterPage = () => {
  const methods = useForm<UserRegistrationSchema>({
    mode: "all",
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: defaultUserRegValues,
  });
  return (
    <>
      <div className="d-flex gap-2 flex-column">
        <h2>Sign Up</h2>
        <div>
          <FormProvider {...methods}>
            <div>
              <UserRegistrationForm></UserRegistrationForm>
              <DevTool control={methods.control} />
            </div>
          </FormProvider>
        </div>
        <div>
          <p>
            Already Have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
