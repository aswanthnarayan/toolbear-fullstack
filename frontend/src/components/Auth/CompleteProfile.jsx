import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import googleIcon from "../../assets/google.png";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useCompleteGoogleSignupMutation } from '../../../App/features/rtkApis/authApi';

const CompleteProfile = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  if(!email) {
    return <Navigate to="/no-access" replace />;
  }
  const [completeGoogleSignup] = useCompleteGoogleSignupMutation();
  
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await completeGoogleSignup({
        email,
        phone: data.phone
      }).unwrap();
      if (response.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/home");
      }
    } catch (error) {
      console.error('Error completing profile:', error);
    } finally {
      setIsSubmitting(false);
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
          Complete Your Profile
        </h1>
        <p className={`text-sm ${currentTheme.textGray}`}>
          Add your phone number to complete the Google sign-up process
        </p>
      </div>
      
      <form className="space-y-6">
        <div className="transform transition-all duration-300 hover:translate-x-1">
          <CustomInput
            label="Phone"
            placeholder="Enter your phone number"
            type="number"
            name="phone"
            id="phone"
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

        <div className="space-y-4">
          <CustomButton
            text={isSubmitting ? "Completing..." : "Complete Google Sign Up"}
            variant="outlined"
            icon={googleIcon}
            type="submit"
            width="w-full"
            height="h-12"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            theme={currentTheme}
            className={`${currentTheme.button} ${currentTheme.buttonHover} text-black font-semibold 
              transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
          />
        </div>

        <div className="mt-6">
          <p className={`text-xs ${currentTheme.textGray} text-center leading-relaxed`}>
            By continuing, you agree to ToolBear's{" "}
            <a href="#" className={`text-yellow-500 hover:text-yellow-600 underline decoration-dotted`}>
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className={`text-yellow-500 hover:text-yellow-600 underline decoration-dotted`}>
              Privacy Policy
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default CompleteProfile;