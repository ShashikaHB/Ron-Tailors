/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { Link } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserRegistrationSchema, defaultUserRegValues, userRegistrationSchema } from '../forms/formSchemas/userRegistrationSchema';
import UserRegistrationForm from '../forms/userRegistration/UserRegistrationForm';
import { useAppSelector } from '../redux/reduxHooks/reduxHooks';
import { otpMode } from '../redux/features/auth/authSlice';

const RegisterPage = () => {
  const methods = useForm<UserRegistrationSchema>({
    mode: 'all',
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: defaultUserRegValues,
  });

  const isOtpMode = useAppSelector(otpMode);

  return (
    <div className="d-flex gap-4 flex-column">
      <h2>{isOtpMode ? 'Enter OTP' : 'Sign Up'}</h2>
      <div>
        <FormProvider {...methods}>
          <div>
            <UserRegistrationForm />
            <DevTool control={methods.control} />
          </div>
        </FormProvider>
      </div>
      <div className="d-flex justify-content-center">
        <small>
          Already Have an account? <Link to="/login">Sign In</Link>
        </small>
      </div>
    </div>
  );
};

export default RegisterPage;
