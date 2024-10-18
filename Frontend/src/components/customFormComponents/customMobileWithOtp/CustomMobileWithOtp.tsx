/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { Box, CircularProgress, ClickAwayListener, Popper } from '@mui/material';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useState } from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import RHFTextField from '../customTextField/RHFTextField';
import { useSendOtpMutation, useVerifyOtpMutation } from '../../../redux/features/auth/authApiSlice';
import { useAppDispatch } from '../../../redux/reduxHooks/reduxHooks';
import { setSelectedCustomerId } from '../../../redux/features/orders/orderSlice';

type CustomMobileWithOtpProps<T> = {
  name: Path<T>;
  label: string;
  onVerify?: () => void;
};

const CustomMobileWithOtp = <T extends FieldValues>({ name, label, onVerify }: CustomMobileWithOtpProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [verified, setVerified] = useState<boolean>(false);
  const [otp, setOtp] = useState(new Array(6).fill(''));

  const [sendOtp, { isLoading: sendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifyingOtp }] = useVerifyOtpMutation();

  const dispatch = useAppDispatch();

  const { getValues } = useFormContext<T>();

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const mobile = getValues(name) as string; // Ensure the type is string
  const customerName = getValues('customer.name' as Path<T>) as string; // Ensure the type is string

  const handleOtpInputChange = (e: any, i: number) => {
    if (Number.isNaN(e.target.value)) return false;

    setOtp([...otp.map((data, index) => (index === i ? e.target.value : data))]);

    if (e.target.value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }

    return true;
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClosePopOver = () => {
    setAnchorEl(null);
  };

  const handleOtpVerification = async () => {
    try {
      const response = await verifyOtp({ mobile, otp: otp.join(), name: name === 'customer.mobile' ? customerName : null }).unwrap();
      if (response) {
        toast.success('Mobile number verified!!');
        setOtp(new Array(6).fill(''));
        handleClosePopOver();
        if (response?.data?.customerId) {
          dispatch(setSelectedCustomerId(response.data.customerId));
        }
        setVerified(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOtpSend = async () => {
    try {
      if (mobile) {
        const otpSend = await sendOtp({ mobile, isCustomer: true }).unwrap();
        if (otpSend) {
          toast.success('OTP Send!');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="col-6 d-flex gap-2 mb-3 align-items-start">
      <RHFTextField<T> label={label} name={name} />
      <button
        className="icon-button otp-add-btn"
        type="button"
        aria-label="mobile_add"
        aria-describedby={id}
        onClick={handleClick}
        disabled={verified || sendingOtp}
      >
        {verified ? (
          <span>
            <FaCheck />
          </span>
        ) : (
          <span>
            <FaPlus />
          </span>
        )}
      </button>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <ClickAwayListener onClickAway={handleClosePopOver}>
          <div className="popover-otp-container">
            <div className="d-flex gap-2 mb-4">
              {otp.map((data: string, index: number) => {
                return <input type="text" key={index} className="otp-input" value={data} maxLength={1} onChange={(e) => handleOtpInputChange(e, index)} />;
              })}
            </div>
            <div className="d-flex align-item-center justify-content-center gap-3">
              <button type="button" className="primary-button" onClick={handleOtpVerification}>
                Verify OTP
              </button>
              {sendingOtp ? (
                <Box sx={{ display: 'flex', color: 'black' }}>
                  <CircularProgress color="inherit" />
                </Box>
              ) : (
                <button type="button" className="secondary-button" onClick={() => handleOtpSend()}>
                  Send Otp
                </button>
              )}
            </div>
          </div>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};

export default CustomMobileWithOtp;
