import React from 'react';
import { useSelector } from 'react-redux';

const ToolThemeBackground = ({ children }) => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const theme = useSelector((state) => state.theme.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <div className={`flex-grow ${currentTheme.primary} relative overflow-hidden`}>
      {/*  background */}
      <div className="absolute inset-0 bg-repeat opacity-5"
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4l-2-2V24v-2l2-2v-4l-2-2V8l4-4 4 4v6l-2 2v4l2 2v2l-2 2v4l2 2v6l-4 4-4-4v-6l2-2zm0-18l-2-2v-4l2-2V8l-4-4-4 4v6l2 2v4l-2 2v2l2 2v4l-2 2v6l4 4 4-4v-6l-2-2v-4l2-2v-2l-2-2v-4l2-2V8z' fill='%23000' fill-opacity='.5'/%3E%3C/g%3E%3C/svg%3E')" }}
      ></div>

      {/*  accent elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-10 transform rotate-45"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-gray-700 to-gray-900 opacity-10 transform -rotate-45"></div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ToolThemeBackground;