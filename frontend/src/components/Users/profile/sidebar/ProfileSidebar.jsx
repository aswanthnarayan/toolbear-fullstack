import React from 'react';
import { List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react";
import {
  UserCircleIcon,
  ShoppingBagIcon,
  HomeIcon,
  CreditCardIcon,
  WalletIcon,
  TicketIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon
} from "@heroicons/react/24/solid";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../../../App/features/slices/authSlice';
import { useLogOutMutation } from '../../../../../App/features/rtkApis/authApi';
import { persistor } from '../../../../../App/store';

const ProfileSidebar = ({ activeSection, onSectionChange }) => {
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logOut] = useLogOutMutation();

  const menuItems = [
    { id: 'edit', label: 'Edit Profile', icon: UserCircleIcon },
    { id: 'orders', label: 'Your Orders', icon: ShoppingBagIcon },
    { id: 'address', label: 'Your Address', icon: HomeIcon },
    { id: 'wallet', label: 'Wallet', icon: WalletIcon },
    { id: 'coupons', label: 'Coupons', icon: TicketIcon },
  ];

  const handleLogout = async () => {
    try {
      await logOut().unwrap();
      dispatch(logout());
      await persistor.purge(); // Purge the persisted state
   
        navigate('/user/deals');
     
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={`h-full flex flex-col ${currentTheme.secondary}`}>
      {/* Mobile Header */}
      <div className={`lg:hidden p-4 border-b ${currentTheme.border}`}>
        <div className="flex items-center justify-between">
          <Typography variant="h5" className={currentTheme.text}>
            Menu
          </Typography>
          <button onClick={() => onSectionChange(activeSection)} className={`p-2 ${currentTheme.text} hover:${currentTheme.textGray}`}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <List className="flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <ListItem
            key={item.id}
            selected={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
            className={`cursor-pointer ${
              activeSection === item.id 
                ? `${currentTheme.hover} text-blue-500` 
                : `hover:${currentTheme.hover} ${currentTheme.text}`
            }`}
          >
            <ListItemPrefix>
              <item.icon className={`h-5 w-5 ${
                activeSection === item.id ? 'text-blue-500' : currentTheme.text
              }`} />
            </ListItemPrefix>
            <Typography className={
              activeSection === item.id ? 'text-blue-500' : currentTheme.text
            }>
              {item.label}
            </Typography>
          </ListItem>
        ))}
      </List>
      
      {/* Sign Out Button */}
      <List className={`mt-auto border-t ${currentTheme.border}`}>
        <ListItem 
          onClick={handleLogout}
          className={`cursor-pointer hover:${currentTheme.hover} text-red-500`}
        >
          <ListItemPrefix>
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Sign Out
        </ListItem>
      </List>
    </div>
  );
};

export default ProfileSidebar;