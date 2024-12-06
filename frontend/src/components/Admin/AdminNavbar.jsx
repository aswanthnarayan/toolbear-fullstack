import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../Logo';
import { logout } from "../../../App/features/slices/authSlice";
import { useLogOutMutation } from "../../../App/features/rtkApis/authApi";
import { persistor } from "../../../App/store";
import { useDispatch, useSelector } from 'react-redux';

function AdminNavbar() {
  const [logOut] = useLogOutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await logOut().unwrap();
      await persistor.purge(); // Purge the persisted state
      dispatch(logout());
      // Navigate based on user role
      const userRole = user?.role;
      navigate(userRole === 'admin' ? '/admin/dashboard' : '/user/deals');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <div className="flex items-center justify-between py-3 px-4 shadow-lg w-full sticky top-0 z-20 bg-white">
      <div className="flex items-center w-full sm:w-auto">
        {/* Logo */}
        <div className="hidden md:block">
          <Logo className="ml-4 md:ml-0 w-32 md:w-40 hover:opacity-90 transition-opacity duration-200" />
        </div>
      </div>
       
      <div className="flex items-center space-x-4 ml-auto ">
        <img 
          src="https://placehold.co/40x40" 
          alt="User avatar" 
          className="h-10 w-10 rounded-full hidden sm:flex"
        />
        
        <div className="text-right">
          <div className="text-xs font-semibold">Aswanth</div>
          <div className="text-xs text-gray-400">Admin</div>
        </div>
        
        <Link  
          className="text-sm text-gray-600 hover:underline"
          onClick={handleLogout}
        >
          Signout
        </Link>
      </div>
    </div>
  );
}

export default AdminNavbar;
