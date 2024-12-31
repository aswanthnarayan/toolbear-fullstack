import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import CustomInput from "../CustomInput.jsx";
import CustomButton from "../CustomButton.jsx";
import googleIcon from '../../assets/google.png';
import { useSignUpGoogleMutation, useVerifyEmailMutation } from '../../../App/features/rtkApis/authApi';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase/config.js';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const SignUp = () => {
  const [sendOtp, { isLoading: isOtpLoading },] = useVerifyEmailMutation();
  const navigate = useNavigate();
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const [signUpGoogle] = useSignUpGoogleMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      clearErrors();
      const response = await sendOtp({ email: data.email, phone: data.phone }).unwrap();
      if (response) {
        navigate('/user/verify-email', {
          state: { name: data.name, email: data.email, phone: data.phone, password: data.password }
        });
      }
    } catch (err) {
      console.error('Error in sending OTP:', err);
      if (err.data?.error?.includes('Email is already in use')) {
        setError('email', { 
          type: 'server', 
          message: 'Email is already in use' 
        });
      } else if (err.data?.error?.includes('Phone is already in use')) {
        setError('phone', { 
          type: 'server', 
          message: 'Phone number is already in use' 
        });
      } else {
        setError('general', { 
          type: 'server', 
          message: err.data?.error || 'An unexpected error occurred' 
        });
      }
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { user } = result;
      
      try {
        const response = await signUpGoogle({
          email: user.email,
          name: user.displayName,
        }).unwrap();
        
        if (response.message === 'New user created' && response.isNewUser) {
          navigate('/user/complete-signup', { 
            state: { email: user.email }
          });
        } else {
          if (response.user.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/user/home");
          }
        }
      } catch (error) {
        console.error('Server error:', error);
        if (error.data?.error?.includes('Email is already in use')) {
          setError('general', { 
            type: 'server', 
            message: 'Something went wrong. Please try signing in instead.' 
          });
        } else {
          setError('general', { 
            type: 'server', 
            message: error.data?.error || 'An error occurred during Google sign up' 
          });
        }
      }
    } catch (error) {
      console.error('Google sign-up error:', error);
      setError('general', { 
        type: 'server', 
        message: 'Could not sign up with Google' 
      });
    }
  };

  return (
    <div className={`${currentTheme.secondary} rounded-xl shadow-2xl p-8 md:p-10 backdrop-blur-sm bg-opacity-95`}>
      <div className="mb-8 text-center relative">
        <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-yellow-500"></div>
        <div className="absolute -top-4 -right-4 w-8 h-8 border-t-4 border-r-4 border-yellow-500"></div>
        <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-4 border-l-4 border-yellow-500"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-yellow-500"></div>
        
        <h1 className={`text-3xl md:text-4xl font-bold ${currentTheme.text} mb-3`}>
          Join ToolBear
        </h1>
        <p className={`text-sm ${currentTheme.textGray}`}>
          Your one-stop shop for quality tools
        </p>
      </div>
      
      {errors.general && (
        <div className="mb-4 text-red-500 text-sm text-center">
          {errors.general.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-5">
          <div className="transform transition-all duration-300 hover:translate-x-1">
            <CustomInput
              label="Name"
              placeholder="Enter your name"
              type="text"
              theme={currentTheme}
              {...register("name", {
                required: "Name is required",
                minLength: { value: 3, message: "Name must be at least 3 characters long" },
                validate: {
                  notEmpty: (value) => value.trim() !== "" || "Name cannot be empty or spaces only",
                  noSpecialChars: (value) => /^[a-zA-Z\s]*$/.test(value) || "Name cannot include special characters"
                } 
              })}
              error={errors.name?.message}
            />
          </div>
          
          <div className="transform transition-all duration-300 hover:translate-x-1">
            <CustomInput
              label="Email"
              placeholder="Enter your email"
              type="email"
              theme={currentTheme}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
              error={errors.email?.message}
            />
          </div>
          
          <div className="transform transition-all duration-300 hover:translate-x-1">
            <CustomInput
              label="Phone"
              placeholder="Enter your phone number"
              type="number"
              theme={currentTheme}
              {...register("phone", {
                required: "Phone number is required",
                minLength: { value: 10, message: "Phone number must be at least 10 digits" },
                maxLength: { value: 10, message: "Phone number must be exactly 10 digits" },
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Invalid phone number. Must be 10 digits starting with 6-9",
                },
              })}
              error={errors.phone?.message}
            />
          </div>
          
          <div className="relative transform transition-all duration-300 hover:translate-x-1">
            <CustomInput
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              theme={currentTheme}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters long" },
                validate: (value) => value.trim() !== "" || "Password cannot be empty or spaces only"
              })}
              error={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-[31px] p-1 rounded-full ${currentTheme.hover} ${currentTheme.text}`}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          
          <div className="relative transform transition-all duration-300 hover:translate-x-1">
            <CustomInput
              label="Re-Enter Password"
              placeholder="Re-Enter your password"
              type={showRePassword ? "text" : "password"}
              theme={currentTheme}
              {...register("reEnterPassword", {
                required: "Please re-enter your password",
                validate: {
                  matchesPassword: (value) => {
                    const password = getValues("password");
                    return value === password || "Passwords do not match";
                  },
                },
              })}
              error={errors.reEnterPassword?.message}
            />
            <button
              type="button"
              onClick={() => setShowRePassword(!showRePassword)}
              className={`absolute right-3 top-[31px] p-1 rounded-full ${currentTheme.hover} ${currentTheme.text}`}
            >
              {showRePassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          <CustomButton
            text={isOtpLoading ? "Creating Account..." : "CREATE ACCOUNT"}
            width="w-full"
            height="h-12"
            disabled={isOtpLoading}
            onClick={handleSubmit(onSubmit)}
            theme={currentTheme}
            className={`${currentTheme.button} ${currentTheme.buttonHover} text-black font-semibold 
              transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
          />
          
          <div className="relative flex items-center justify-center my-6">
            <div className={`absolute w-full h-0.5 ${currentTheme.border}`}></div>
            <span className={`relative px-4 ${currentTheme.secondary} ${currentTheme.text} text-sm`}>
              or continue with
            </span>
          </div>

          <CustomButton
            onClick={handleGoogleSignUp}
            text="Sign Up with Google"
            variant="outlined"
            icon={googleIcon}
            width="w-full"
            height="h-12"
            theme={currentTheme}
            className={`${currentTheme.button} ${currentTheme.buttonHover} text-black
              transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
          />
        </div>

        <div className="mt-8 space-y-4">
          <p className={`text-xs ${currentTheme.textGray} text-center leading-relaxed`}>
            By creating an account, you agree to ToolBear's{" "}
            <a href="#" className="text-yellow-600 hover:text-yellow-700 underline decoration-dotted">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-yellow-600 hover:text-yellow-700 underline decoration-dotted">
              Privacy Policy
            </a>
          </p>

          <p className={`text-center ${currentTheme.text} text-sm`}>
            Already have an account?{" "}
            <Link 
              to="/user/signin" 
              className="text-yellow-600 hover:text-yellow-700 font-semibold 
                transition-all duration-300 border-b-2 border-transparent hover:border-yellow-600"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
