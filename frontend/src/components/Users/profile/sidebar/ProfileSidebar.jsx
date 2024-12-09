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

const ProfileSidebar = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'edit', label: 'Edit Profile', icon: UserCircleIcon },
    { id: 'orders', label: 'Your Orders', icon: ShoppingBagIcon },
    { id: 'address', label: 'Your Address', icon: HomeIcon },
    { id: 'payment', label: 'Payment Methods', icon: CreditCardIcon },
    { id: 'wallet', label: 'Wallet', icon: WalletIcon },
    { id: 'coupons', label: 'Coupons', icon: TicketIcon },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Mobile Header */}
      <div className="lg:hidden p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
            Menu
          </Typography>
          <button onClick={() => onSectionChange(activeSection)} className="p-2">
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
            className={`cursor-pointer hover:bg-gray-100 ${
              activeSection === item.id ? 'bg-gray-100 text-blue-500' : ''
            }`}
          >
            <ListItemPrefix>
              <item.icon className={`h-5 w-5 ${activeSection === item.id ? 'text-blue-500' : ''}`} />
            </ListItemPrefix>
            <Typography color={activeSection === item.id ? 'blue' : 'blue-gray'}>
              {item.label}
            </Typography>
          </ListItem>
        ))}
      </List>
      
      {/* Sign Out Button */}
      <List className="mt-auto border-t border-gray-200">
        <ListItem className="cursor-pointer hover:bg-gray-100 text-red-500">
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