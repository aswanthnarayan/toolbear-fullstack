import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import CustomInput from '../Users/CustomInput';
import CustomButton from '../Users/CustomButton';
import { useForgotPwOtpConfirmMutation, useForgotPwemailVerificationMutation } from '../../../App/features/rtkApis/authApi';

const ForgotPwOtpVerification = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const theme = useSelector((state) => state.theme.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  
  if (!email) {
    return <Navigate to="/no-access" replace />;
  }
  const [forgotPwOtpConfirm, { isLoading: isVerifying }] = useForgotPwOtpConfirmMutation();
  const [forgotPwemailVerification, { isLoading: isResending }] = useForgotPwemailVerificationMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await forgotPwOtpConfirm({ 
        email, 
        otp: data.otp 
      }).unwrap();
      
      if (response.message === "OTP verified successfully") {
        navigate('/user/forgot-password/change-password', {
          state: { email }
        });
      }
    } catch (err) {
      if (err.data?.error) {
        setError('otp', { 
          type: 'server', 
          message: err.data.error 
        });
      } else {
        setError('general', { 
          type: 'server', 
          message: 'An unexpected error occurred' 
        });
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      await forgotPwemailVerification({ email }).unwrap();
    } catch (err) {
      setError('general', { 
        type: 'server', 
        message: 'Failed to resend OTP. Please try again.' 
      });
    }
  };

  if (!email) {
    navigate('/user/forgot-password/verify-email');
    return null;
  }

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
          Verify Your Email
        </h1>
        <div className={`text-sm ${currentTheme.text} text-opacity-70 space-y-2`}>
          <p>To verify your email, we've sent a One Time Password (OTP) to</p>
          <p className={`${currentTheme.text} font-semibold`}>
            {email}
          </p>
        </div>
      </div>

      {errors.general && (
        <div className="mb-4 text-red-500 text-sm text-center">
          {errors.general.message}
        </div>
      )}
      
      <form  className="space-y-6">
        {/* Input field with industrial-themed animation */}
        <div className="transform transition-all duration-300 hover:translate-x-1">
          <CustomInput
            label="OTP"
            placeholder="Enter OTP"
            type="text"
            {...register("otp", {
              required: "OTP is required",
              pattern: {
                value: /^\d{6}$/,
                message: "OTP must be 6 digits"
              }
            })}
            error={errors.otp?.message}
          />
        </div>

        <div className="space-y-4">
          <CustomButton
            text={isVerifying ? "Verifying..." : "VERIFY OTP"}
            onClick={handleSubmit(onSubmit)}
            type="submit"
            width="w-full"
            height="h-12"
            disabled={isVerifying}
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

export default ForgotPwOtpVerification;