import React from "react";
import ForgotPwOtpVerification from "../../components/Auth/ForgotPwOtpVerification";
import Logo from "../../components/Logo";
import { useSelector } from "react-redux";
import ToolThemeBackground from "../../components/Auth/ToolThemeBackground";
import SecondaryFooter from "../../components/Users/SecondaryFooter";
import { useLocation } from "react-router-dom";

const ForgotPwOtpConfirmPage = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const theme = useSelector((state) => state.theme.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <ToolThemeBackground>
        {/* Main content */}
        <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center relative z-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <Logo className="mx-auto transform hover:scale-105 transition-transform duration-300" />
            </div>
              <ForgotPwOtpVerification /> 
          </div>
        </div>
      </ToolThemeBackground>
      <SecondaryFooter />
    </div>
  );
};

export default ForgotPwOtpConfirmPage;


// {location.state?.email ? (
//   <ForgotPwOtpVerification />
// ) 
// : (
//   <div className="text-red-500 text-center">
//     No email provided. Please start from the forgot password page.
//   </div>
// )}