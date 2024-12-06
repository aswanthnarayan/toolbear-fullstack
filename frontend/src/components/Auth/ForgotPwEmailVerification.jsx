import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useForgotPwemailVerificationMutation } from '../../../App/features/rtkApis/authApi';
import CustomInput from '../CustomInput';
import CustomButton from '../CustomButton';

const ForgotPwEmailVerification = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const theme = useSelector((state) => state.theme.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const navigate = useNavigate();
  
  const [forgotPwemailVerification, { isLoading }] = useForgotPwemailVerificationMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await forgotPwemailVerification({ email: data.email }).unwrap();
      if (response.message === "OTP sent successfully") {
        navigate('/user/forgot-password/verify-otp',{
          state: { email: data.email }
         });
      }
    } catch (err) {
      if (err.status === 404) {
        setError('email', { 
          type: 'server', 
          message: 'No account found with this email address' 
        });
      } else {
        setError("general", { type: "manual", message: "An unexpected error occurred." });
      }
    }
  };

  return (
    <div className={`${currentTheme.secondary} rounded-lg shadow-lg bg-opacity-95 
      p-8 md:p-10 border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="mb-8 text-center relative">
        <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-yellow-500"></div>
        <div className="absolute -top-4 -right-4 w-8 h-8 border-t-4 border-r-4 border-yellow-500"></div>
        <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-4 border-l-4 border-yellow-500"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-yellow-500"></div>
        
        <h1 className={`text-3xl md:text-4xl font-bold ${currentTheme.text} mb-3`}>
          Reset Password
        </h1>
        <p className={`text-sm ${currentTheme.text} text-opacity-70`}>
          Enter your email address and we'll send you a one-time password to verify your identity
        </p>
      </div>
      
      {errors.general && (
    <div className="mb-4 text-red-500 text-sm text-center">
      {errors.general.message}
    </div>
  )}

      <form  className="space-y-6">
        <div className="transform transition-all duration-300 hover:translate-x-1">
          <CustomInput
            label="Email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
          />
        </div>

        <div className="pt-2">
          <CustomButton
            text="Get OTP"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            width="w-full"
            height="h-12"
            className={`bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold 
              transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
          >
            {isLoading ? 'Sending OTP...' : 'Get OTP'}
            
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default ForgotPwEmailVerification;