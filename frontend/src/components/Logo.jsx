import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Logo = () => {
  const navigate = useNavigate();
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <div
    onClick={()=>navigate('/')}
    className={`flex items-center ${currentTheme.text} font-bold text-xl`}>
      <svg
        className="h-8 w-8 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
      <span className="hidden sm:inline">ToolBear</span>
    </div>
  );
};

export default Logo;