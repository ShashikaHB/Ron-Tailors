/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { UserRegistrationSchema } from '../formSchemas/userRegistrationSchema';
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';
import { Roles } from '../../enums/Roles';
import { useRegisterMutation, useSendOtpMutation, useVerifyOtpMutation } from '../../redux/features/auth/authApiSlice';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks/reduxHooks';
import { otpMode, setCredentials, setOtpMode } from '../../redux/features/auth/authSlice';
import RHFDropDown from '../../components/customFormComponents/customDropDown/RHFDropDown';

const roles = [
  {
    value: Roles.SalesPerson,
    label: 'Sales Person',
  },
  {
    value: Roles.Cutter,
    label: 'Cutter',
  },
  {
    value: Roles.Tailor,
    label: 'Tailor',
  },
  {
    value: Roles.IroningPerson,
    label: 'Ironing Person',
  },
  {
    value: Roles.AlteringPerson,
    label: 'AlteringPerson',
  },
  {
    value: Roles.Cleaning,
    label: 'Cleaning Staff',
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
  const isOtpMode = useAppSelector(otpMode);
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [tempUserData, setTempUserData] = useState({ name: '', mobile: '', role: '', password: '', confirmPassword: '' });

  const [registerUser, { isLoading: loadingRegister }] = useRegisterMutation();
  const [sendOtp, { isLoading: sendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifyingOtp }] = useVerifyOtpMutation();

  const handleOtpInputChange = (e: any, i: number) => {
    if (Number.isNaN(e.target.value)) return false;

    setOtp([...otp.map((data, index) => (index === i ? e.target.value : data))]);

    if (e.target.value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }

    return true;
  };

  const handleOtpSend = async (mobile?: string) => {
    try {
      const otpSend = await sendOtp(mobile ?? tempUserData?.mobile).unwrap();
      if (otpSend) {
        toast.success('OTP Send!');
        dispatch(setOtpMode(true));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOtpVerification = async () => {
    try {
      const otpVerified = await verifyOtp({ mobile: tempUserData?.mobile, otp: otp.join() }).unwrap();
      if (otpVerified) {
        const userData = await registerUser(tempUserData).unwrap();
        dispatch(
          setCredentials({
            ...userData,
            allUsers: [],
            otpMode: false,
          })
        );
        navigate('/secured/dashboard');
        reset();
        toast.success(userData.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit: SubmitHandler<UserRegistrationSchema> = async (data) => {
    setTempUserData(data);
    handleOtpSend(data.mobile);
  };

  useEffect(() => {
    dispatch(setOtpMode(false));
  }, []);

  return (
    <>
      {!isOtpMode && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="inputGroup gap-3 d-flex flex-column mt-4">
            <RHFTextField<UserRegistrationSchema> label="Name" name="name" />
            <RHFTextField<UserRegistrationSchema> label="Mobile" name="mobile" />
            <RHFTextField<UserRegistrationSchema> label="Password" name="password" />
            <RHFTextField<UserRegistrationSchema> label="Confirm Password" name="confirmPassword" />
            <RHFDropDown<UserRegistrationSchema> label="Role" name="role" options={roles} />
          </div>
          <div className="w-100 mt-5">
            <button type="submit" className="primary-button w-100">
              Sign Up
            </button>
          </div>
        </form>
      )}
      {isOtpMode && (
        <div className="d-flex flex-column align-items-center">
          <div className="otp-area">
            {otp.map((data: string, index: number) => {
              return <input type="text" key={index} className="otp-input" value={data} maxLength={1} onChange={(e) => handleOtpInputChange(e, index)} />;
            })}
          </div>
          <div className="otp-area d-flex align-item-center justify-content-center">
            <button type="button" className="primary-button w-50" onClick={handleOtpVerification}>
              Verify OTP
            </button>
            <button type="button" className="secondary-button w-50" onClick={() => handleOtpSend()}>
              Send Otp again
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserRegistrationForm;
