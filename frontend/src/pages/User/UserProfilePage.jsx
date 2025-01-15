import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import ProfileSidebar from '../../components/Users/profile/sidebar/ProfileSidebar';
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useSelector } from 'react-redux';

const UserProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  
  // Get active section from the current path
  const activeSection = location.pathname.split('/').pop();

  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  return (
    <div className={`min-h-screen pt-[112px]  w-full ${currentTheme.primary}`}>
      <div className="flex relative w-full">
        {/* Desktop Sidebar */}
        <div className={`hidden lg:block w-72 h-[calc(100vh-112px)] sticky top-[112px] border-r ${currentTheme.border} ${currentTheme.secondary}`}>
          <ProfileSidebar 
            activeSection={activeSection}
            onSectionChange={(section) => navigate(`/user/profile/${section}`)}
          />
        </div>

        {/* Mobile Sidebar - Overlay */}
        <div className={`
          lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40
          ${isSidebarOpen ? 'block' : 'hidden'}
        `} onClick={() => setIsSidebarOpen(false)} />

        {/* Mobile Sidebar - Content */}
        <div className={`
          lg:hidden fixed left-0 top-0 h-full w-72 ${currentTheme.secondary} z-50 transform transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <ProfileSidebar 
            activeSection={activeSection} 
            onSectionChange={(section) => {
              navigate(`/user/profile/${section}`);
              setIsSidebarOpen(false);
            }}
          />
        </div>

        {/* Main Content */}
        <div className={`flex-1 min-h-[calc(100vh-112px)] ${currentTheme.primary}`}>
          <div className="max-w-4xl p-2 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className={`lg:hidden fixed bottom-4 right-4 z-30 ${currentTheme.button} ${currentTheme.buttonHover} text-black p-3 rounded-full shadow-lg`}
        >
          <UserCircleIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default UserProfilePage;