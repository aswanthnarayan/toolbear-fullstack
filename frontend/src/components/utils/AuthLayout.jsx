import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthLayout = () => {
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (user) {
    return <Navigate to="/user/home" replace />;
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${currentTheme.primary}`}>
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;