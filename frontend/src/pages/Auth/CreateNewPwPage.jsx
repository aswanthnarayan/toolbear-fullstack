import React from "react";
import Logo from "../../components/Logo";
import { useSelector } from "react-redux";
import ToolThemeBackground from "../../components/Auth/ToolThemeBackground";
import SecondaryFooter from "../../components/Users/SecondaryFooter";
import ChangePassword from "../../components/Auth/ChangePassword";

const CreateNewPwPage = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const theme = useSelector((state) => state.theme.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <div className="min-h-screen flex flex-col">
      <ToolThemeBackground>
        {/* Main content */}
        <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center relative z-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <Logo className="mx-auto transform hover:scale-105 transition-transform duration-300" />
            </div>
            <ChangePassword/>
          </div>
        </div>
      </ToolThemeBackground>
      <SecondaryFooter />
    </div>
  );
};

export default CreateNewPwPage;
