import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useCreateUserMutation, useResendOtpMutation } from '../../../App/features/rtkApis/authApi';
import OtpVerification from './OtpVerification';

const EmailVerification = () => {
  const { state } = useLocation();
  const [createUser, { isLoading, error }] = useCreateUserMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const navigate = useNavigate();
  const [verificationError, setVerificationError] = useState(null);

  if (!state?.email) {
    return <Navigate to="/no-access" replace />;
  }

  const handleVerify = async (otp) => {
    try {
      const response = await createUser({
        email: state.email,
        otp: otp,
        name: state.name,
        phone: state.phone,
        password: state.password,
      }).unwrap();

      if (response.message === 'Account created successfully') {
        navigate('/user/signin');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setVerificationError(err.data?.error || 'Verification failed');
    }
  };

  const handleResend = async () => {
    try {
      const response = await resendOtp({
        email: state.email,
        type: 'signup'
      }).unwrap();
      
      return response.success;
    } catch (err) {
      console.error('Failed to resend OTP:', err);
      return false;
    } finally {
      setVerificationError(null);
    }
  };

  return (
    <OtpVerification
      email={state.email}
      title="Verify Email"
      subtitle="To verify your email, we've sent a One Time Password (OTP)"
      buttonText="VERIFY EMAIL"
      onVerify={handleVerify}
      onResend={handleResend}
      isVerifying={isLoading}
      isResending={isResending}
      verificationError={verificationError}
      type="signup"
    />
  );
};

export default EmailVerification;
