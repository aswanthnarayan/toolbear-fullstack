import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CustomButton from '../components/Users/CustomButton';
import { FaTools, FaLock } from 'react-icons/fa';

const NoAccessPage = () => {
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const theme = useSelector((state) => state.theme.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <div className={`min-h-screen ${currentTheme.primary} flex items-center justify-center p-4`}>
      <div className={`${currentTheme.secondary} rounded-lg shadow-xl p-8 md:p-12 max-w-md w-full relative`}>
        {/* Decorative corners */}
        <div className="absolute -top-4 -left-4 w-12 h-12 border-t-4 border-l-4 border-yellow-500"></div>
        <div className="absolute -top-4 -right-4 w-12 h-12 border-t-4 border-r-4 border-yellow-500"></div>
        <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-4 border-l-4 border-yellow-500"></div>
        <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-4 border-r-4 border-yellow-500"></div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <FaTools className={`text-6xl ${currentTheme.text} opacity-20 absolute -top-1 -left-1`} />
            <FaLock className={`text-6xl ${currentTheme.text}`} />
          </div>
        </div>

        <h1 className={`text-3xl md:text-4xl font-bold ${currentTheme.text} text-center mb-4`}>
          Access Restricted
        </h1>
        
        <p className={`${currentTheme.text} text-opacity-70 text-center mb-8`}>
          Sorry, you don't have permission to access this area. Please contact your administrator if you believe this is a mistake.
        </p>

        <div className="flex justify-center">
          <CustomButton
            text="Back to Home"
            onClick={() => navigate('/user/home')}
            width="w-full md:w-auto"
            height="h-12"
            className={`bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold 
              transform transition-all duration-300 hover:scale-105 hover:shadow-lg
              px-8`}
          />
        </div>
      </div>
    </div>
  );
};

export default NoAccessPage;