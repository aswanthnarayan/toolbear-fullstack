import React from "react";
import ForgotPwEmailVerification from "../../components/Auth/ForgotPwEmailVerification";
import Logo from "../../components/Logo";
import { useSelector } from "react-redux";
import ToolThemeBackground from "../../components/Auth/ToolThemeBackground";
import SecondaryFooter from "../../components/Users/SecondaryFooter";

const ForgotPwEmailVerificationPage = () => {
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <div className={`min-h-screen flex flex-col ${currentTheme.primary}`}>
      <ToolThemeBackground>
        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col items-center relative z-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <Logo className="mx-auto transform hover:scale-105 transition-transform duration-300" />
            </div>
            <ForgotPwEmailVerification />
          </div>
        </div>
      </ToolThemeBackground>
      <SecondaryFooter theme={currentTheme} />
    </div>
  );
};

export default ForgotPwEmailVerificationPage;
