import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CustomInput from '../CustomInput';
import CustomButton from '../CustomButton';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useCreateUserMutation } from '../../../App/features/rtkApis/authApi';

const EmailVerification = () => {
  const { state } = useLocation();
  const [otp, setOtp] = useState('');
  const [createUser, { isLoading, error }] = useCreateUserMutation();
  const navigate = useNavigate();

  if (!state?.email) {
    return <Navigate to="/no-access" replace />;
  }

  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const theme = useSelector((state) => state.theme.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const [isResending, setIsResending] = useState(false);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser({
        email: state.email,
        otp,
        name: state.name,
        phone: state.phone,
        password: state.password,
      }).unwrap();

      if (response.message === 'User successfully created') {
        navigate('/user/signin');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      // Your resend OTP logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={`${currentTheme.secondary} rounded-lg shadow-lg bg-opacity-95 
      p-8 md:p-10 border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="mb-8 text-center relative">
        {/* Tool-themed decorative elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-yellow-500"></div>
        <div className="absolute -top-4 -right-4 w-8 h-8 border-t-4 border-r-4 border-yellow-500"></div>
        <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-4 border-l-4 border-yellow-500"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-yellow-500"></div>
        
        <h1 className={`text-3xl md:text-4xl font-bold ${currentTheme.text} mb-3`}>
          Verify Email
        </h1>
        <div className={`text-sm ${currentTheme.text} text-opacity-70 space-y-2`}>
          <p>To verify your email, we've sent a One Time Password (OTP) to</p>
          <p className={`${currentTheme.text} font-semibold`}>
            {state?.email || "No email provided"}
          </p>
        </div>
      </div>
      
      <form className="space-y-6" >
        {/* Input field with industrial-themed animation */}
        <div className="transform transition-all duration-300 hover:translate-x-1">
          <CustomInput
            label="OTP"
            placeholder="Enter OTP"
            type="number"
            name="otp"
            id="otp"
            onChange={(e) => setOtp(e.target.value)}
            value={otp}
          />
        </div>

        {error && (
          <p className={`text-red-500 text-sm text-center animate-fade-in`}>
            {error?.data?.error || "Invalid OTP"}
          </p>
        )}

        <div className="space-y-4">
          <CustomButton
            text={isLoading ? "Verifying..." : "VERIFY EMAIL"}
            type="submit"
            width="w-full"
            height="h-12"
            onClick={handleVerifyOtp}
            disabled={isLoading}
            className={`bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold 
              transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
          />
          
          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isResending}
              className="text-yellow-600 hover:text-yellow-700 text-sm font-semibold 
                transition-all duration-300 border-b-2 border-transparent hover:border-yellow-600
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          </div>
        </div>

        <div className="mt-6">
          <p className={`text-xs ${currentTheme.text} text-opacity-70 text-center leading-relaxed`}>
            Didn't receive the email? Check your spam folder or{" "}
            <a href="#" className="text-yellow-600 hover:text-yellow-700 underline decoration-dotted">
              contact support
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default EmailVerification;