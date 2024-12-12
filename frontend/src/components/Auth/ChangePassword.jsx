import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import CustomInput from '../CustomInput';
import CustomButton from '../CustomButton';
import { useCreateNewPwMutation } from '../../../App/features/rtkApis/authApi';

const ChangePassword = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const theme = useSelector((state) => state.theme.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  
  if(!email) {
    return <Navigate to="/no-access" replace />;
  }
  
  const [createNewPw, { isLoading }] = useCreateNewPwMutation();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const response = await createNewPw({ 
        email,
        password: data.password 
      }).unwrap();
      
      if (response.message === "Password updated successfully") {
        navigate('/user/signin');
      }
    } catch (err) {
      console.error('Password change error:', err);
      setError('general', { 
        type: 'server', 
        message: err.data?.error || 'An unexpected error occurred' 
      });
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
          Create new password
        </h1>
        <p className={`text-sm ${currentTheme.text} text-opacity-70`}>
          We'll ask for this password whenever you Sign-In.
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
            label="Password"
            placeholder="Enter your password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long"
              },
              validate: (value) => value.trim() !== "" || "Password cannot be empty or spaces only"
            })}
            error={errors.password?.message}
          />
        </div>

        <div className="transform transition-all duration-300 hover:translate-x-1">
          <CustomInput
            label="Confirm Password"
            placeholder="Confirm your password"
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: value => 
                value === password || "Passwords do not match"
            })}
            error={errors.confirmPassword?.message}
          />
        </div>

        <div className="mt-8">
          <CustomButton
            text={isLoading ? "Updating Password..." : "UPDATE PASSWORD"}
            type="submit"
            width="w-full"
            height="h-12"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className={`bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold 
              transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
          />
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;