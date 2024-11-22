import React from 'react';
import { useSelector } from 'react-redux';

function SecondaryFooter() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const theme = useSelector((state) => state.theme.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <footer className={`text-center ${currentTheme.secondary} py-12 border ${isDarkMode ? 'border-t-gray-700' : 'border-t-gray-200'}`}>
      <p className={`${currentTheme.text} text-opacity-75 text-xs`}>
        <a className={`${currentTheme.text} hover:${currentTheme.hover} transition-colors duration-200`} href="#">
          Conditions of Use
        </a>
        <a className={`${currentTheme.text} hover:${currentTheme.hover} transition-colors duration-200 mx-2`} href="#">
          Privacy Notice
        </a>
        <a className={`${currentTheme.text} hover:${currentTheme.hover} transition-colors duration-200`} href="#">
          Help
        </a>
      </p>
      <p className={`${currentTheme.text} text-opacity-75 text-xs mt-2`}>
        2020-2024, Toolbear.com, Inc. or its affiliates
      </p>
    </footer>
  );
}

export default SecondaryFooter;
