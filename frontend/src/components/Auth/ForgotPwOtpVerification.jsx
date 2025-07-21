import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useForgotPwOtpConfirmMutation, useResendOtpMutation } from '../../../App/features/rtkApis/authApi';
import OtpVerification from './OtpVerification';

const ForgotPwOtpVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [forgotPwOtpConfirm, { isLoading, error }] = useForgotPwOtpConfirmMutation();
  const [resendOtp, { isLoading: isResending, error: resendError }] = useResendOtpMutation();
  const [verificationError, setVerificationError] = useState(null);
  const [resendErrorState, setResendError] = useState(null);

  if (!email) {
    return <Navigate to="/no-access" replace />;
  }

  const handleVerify = async (otp) => {
    try {
      const response = await forgotPwOtpConfirm({ 
        email, 
        otp 
      }).unwrap();
      
      if (response.message === "OTP verified successfully") {
        navigate('/user/forgot-password/change-password', {
          state: { email }
        });
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setVerificationError(err.data?.error || 'Verification failed');
    }
  };

  const handleResend = async () => {
    try {
      const response = await resendOtp({
        email,
        type: 'password-reset'
      }).unwrap();
      
      setResendError(null);
      return response.success;
    } catch (err) {
      console.error('Failed to resend OTP:', err);
      setResendError(err.data?.error || 'Failed to resend OTP');
      return false;
    }
  };

  const clearErrors = () => {
    setVerificationError(null);
    setResendError(null);
  };

  return (
    <OtpVerification
      email={email}
      title="Verify Your Email"
      subtitle="To verify your email, we've sent a One Time Password (OTP)"
      buttonText="VERIFY OTP"
      onVerify={handleVerify}
      onResend={handleResend}
      isVerifying={isLoading}
      isResending={isResending}
      verificationError={verificationError}
      resendError={resendErrorState}
      clearErrors={clearErrors}
      type="password-reset"
    />
  );
};

export default ForgotPwOtpVerification;