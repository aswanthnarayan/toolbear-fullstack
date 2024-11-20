import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

function AdminNavbar() {
  return (
    <div className="flex items-center justify-between py-3 px-4 shadow-lg w-full">
      {/* Left Section: Logo and Search Bar */}
      <div className="flex items-center w-full sm:w-auto">
        {/* Logo */}
        <div className="hidden md:block">
          <Logo className="ml-4 md:ml-0 w-32 md:w-40 hover:opacity-90 transition-opacity duration-200" />
        </div>
      </div>
       
      {/* Right Section: User Info */}
      <div className="flex items-center space-x-4 ml-auto ">
        {/* User Avatar */}
        <img 
          src="https://placehold.co/40x40" 
          alt="User avatar" 
          className="h-10 w-10 rounded-full hidden sm:flex"
        />
        
        {/* User Details */}
        <div className="text-right">
          <div className="text-xs font-semibold">Aswanth</div>
          <div className="text-xs text-gray-400">Admin</div>
        </div>
        
        {/* Signout Link */}
        <Link 
          to="#" 
          className="text-sm text-gray-600 hover:underline"
        >
          Signout
        </Link>
      </div>
    </div>
  );
}

export default AdminNavbar;
