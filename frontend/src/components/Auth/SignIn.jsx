import React, { useState } from "react";
import CustomInput from "../CustomInput.jsx";
import CustomButton from "../CustomButton.jsx";
import googleIcon from "../../assets/google.png";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSignInMutation, useSignUpGoogleMutation } from '../../../App/features/rtkApis/authApi';
import { useSelector } from 'react-redux';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase/config.js';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const SignIn = () => {
  const [signIn, { isLoading }] = useSignInMutation();
  const [signUpGoogle] = useSignUpGoogleMutation();
  const [generalError, setGeneralError] = React.useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { user } = result;
      
      try {
        const response = await signUpGoogle({
          email: user.email,
          name: user.displayName,
        }).unwrap();
        
        if (response.isNewUser) {
          navigate('/user/complete-signup', { 
            state: { email: user.email }
          });
        } else if (response.user) {
          if (response.user.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/user/home");
          }
        }
      } catch (error) {
        console.error('Server error:', error);
        setError('general', { 
          type: 'server', 
          message: error.data?.error || 'An error occurred during Google sign in' 
        });
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('general', { 
        type: 'server', 
        message: 'Failed to sign in with Google'
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      clearErrors();
      const response = await signIn({ email: data.email, password: data.password }).unwrap();
      if (response.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/home");
      }
    } catch (err) {
      console.error('Sign in error:', err);
      if (err.data?.field === 'email') {
        setError('email', { 
          type: 'server', 
          message: err.data.message || 'User does not exist' 
        });
      } else if (err.data?.field === 'password') {
        setError('password', { 
          type: 'server', 
          message: err.data.message || 'Incorrect password' 
        });
      } else {
        setError('general', { 
          type: 'server', 
          message: err.data?.error || 'An unexpected error occurred' 
        });
      }
    }
  };

  return (
    <div className={`${currentTheme.secondary} rounded-xl shadow-2xl p-8 md:p-10 backdrop-blur-sm bg-opacity-95`}>
      <div className="mb-8 text-center relative">
        {/* Tool-themed decorative elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-yellow-500"></div>
        <div className="absolute -top-4 -right-4 w-8 h-8 border-t-4 border-r-4 border-yellow-500"></div>
        <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-4 border-l-4 border-yellow-500"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-yellow-500"></div>
        
        <h1 className={`text-3xl md:text-4xl font-bold ${currentTheme.text} mb-3`}>
          Welcome to ToolBear
        </h1>
        <p className={`text-sm ${currentTheme.textGray}`}>
          Your trusted source for quality tools
        </p>
      </div>
      
      {errors.general && (
        <div className="mb-4 text-red-500 text-sm text-center">
          {errors.general.message}
        </div>
      )}
      
      <form className="space-y-5">
        <div className="space-y-5">
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

          <div className="relative transform transition-all duration-300 hover:translate-x-1">
            <CustomInput
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              theme={currentTheme}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
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

          <div className="flex justify-end">
            <Link
              to="/user/forgot-password/verify-email"
              className="text-yellow-600 hover:text-yellow-700 text-sm font-semibold 
                transition-all duration-300 border-b-2 border-transparent hover:border-yellow-600"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          <CustomButton
            text="Sign In"
            variant="outlined"
            type="submit"
            width="w-full"
            height="h-12"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
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
            text="Sign in with Google"
            variant="outlined"
            icon={googleIcon}
            type="button"
            width="w-full"
            height="h-12"
            onClick={handleGoogleSignIn}
            theme={currentTheme}
            className={`${currentTheme.button} ${currentTheme.buttonHover} text-black
              transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
          />
        </div>

        <div className="mt-8 space-y-4">
          <p className={`text-xs ${currentTheme.textGray} text-center leading-relaxed`}>
            By signing in, you agree to ToolBear's{" "}
            <a href="#" className="text-yellow-600 hover:text-yellow-700 underline decoration-dotted">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-yellow-600 hover:text-yellow-700 underline decoration-dotted">
              Privacy Policy
            </a>
          </p>

          <p className={`text-center ${currentTheme.text} text-sm`}>
            Don't have an account?{" "}
            <Link to="/user/signup" className="text-yellow-600 hover:text-yellow-700 font-semibold 
              transition-all duration-300 border-b-2 border-transparent hover:border-yellow-600">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
