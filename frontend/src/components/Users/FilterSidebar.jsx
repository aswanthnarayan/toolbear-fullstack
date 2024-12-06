import React from 'react';
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Slider,
  Checkbox,
} from "@material-tailwind/react";
import { useSelector } from 'react-redux';
import { XMarkIcon } from "@heroicons/react/24/outline";

export function FilterSidebar({ isOpen, onClose }) {
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <Card
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:sticky fixed top-[112px] left-0 h-[calc(100vh-112px)] w-72 shadow-xl transition-transform duration-300 z-40 ${
          isDarkMode ? currentTheme.secondary : "bg-white"
        } flex flex-col overflow-hidden !rounded-none`}
      >
        <div className={`p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b bg-inherit z-10`}>
          <Typography variant="h5" color="blue-gray" className="lg:text-center">
            Filters
          </Typography>
          <button 
            onClick={onClose} 
            className="lg:hidden absolute right-4 top-4"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <List className="p-0">
            {/* Price Range */}
            <ListItem className="flex-col items-start">
              <Typography variant="h6" className="mb-4">
                Price Range
              </Typography>
              <div className="w-full px-2">
                <Slider defaultValue={50} className="text-yellow-500" />
                <div className="flex justify-between mt-2">
                  <span>₹0</span>
                  <span>₹10000</span>
                </div>
              </div>
            </ListItem>

            {/* Categories */}
            <ListItem className="flex-col items-start">
              <Typography variant="h6" className="mb-4">
                Categories
              </Typography>
              <List className="w-full p-0">
                {["Power Tools", "Hand Tools", "Safety Equipment", "Measuring Tools"].map(
                  (category) => (
                    <ListItem key={category} className="p-0">
                      <label className="flex w-full cursor-pointer items-center px-3 py-2">
                        <ListItemPrefix className="mr-3">
                          <Checkbox
                            color="yellow"
                            className="h-5 w-5"
                            ripple={false}
                          />
                        </ListItemPrefix>
                        <Typography color="blue-gray" className="font-medium">
                          {category}
                        </Typography>
                      </label>
                    </ListItem>
                  )
                )}
              </List>
            </ListItem>

            {/* Brands */}
            <ListItem className="flex-col items-start">
              <Typography variant="h6" className="mb-4">
                Brands
              </Typography>
              <List className="w-full p-0">
                {["DeWalt", "Bosch", "Stanley", "3M", "Makita"].map((brand) => (
                  <ListItem key={brand} className="p-0">
                    <label className="flex w-full cursor-pointer items-center px-3 py-2">
                      <ListItemPrefix className="mr-3">
                        <Checkbox
                          color="yellow"
                          className="h-5 w-5"
                          ripple={false}
                        />
                      </ListItemPrefix>
                      <Typography color="blue-gray" className="font-medium">
                        {brand}
                      </Typography>
                    </label>
                  </ListItem>
                ))}
              </List>
            </ListItem>
          </List>
        </div>

        <style jsx global>{`
          /* Custom scrollbar styles */
          .scrollbar-thin::-webkit-scrollbar {
            width: 4px;
          }
          
          .scrollbar-thin::-webkit-scrollbar-track {
            background: ${isDarkMode ? '#1a1a1a' : '#f1f1f1'};
          }
          
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: ${isDarkMode ? '#4a4a4a' : '#888'};
            border-radius: 2px;
          }
          
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: ${isDarkMode ? '#606060' : '#555'};
          }

          /* Firefox */
          .scrollbar-thin {
            scrollbar-width: thin;
            scrollbar-color: ${isDarkMode ? '#4a4a4a #1a1a1a' : '#888 #f1f1f1'};
          }
        `}</style>
      </Card>
    </>
  );
}

export default FilterSidebar;
