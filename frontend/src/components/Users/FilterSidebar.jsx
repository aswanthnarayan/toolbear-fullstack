import React, { useState, useMemo } from 'react';
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Checkbox,
} from "@material-tailwind/react";
import { useSelector } from 'react-redux';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useGetAllCategoriesQuery, useGetAllBrandsQuery } from '../../../App/features/rtkApis/adminApi';

const FilterSidebar = ({ isOpen, onClose, onApplyFilters }) => {
  const { data: categoriesData } = useGetAllCategoriesQuery({ 
    page: 1, 
    limit: 100  // Get all categories
  });
  const { data: brandsData } = useGetAllBrandsQuery({ 
    page: 1, 
    limit: 100  // Get all brands
  });

  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    brands: [],
    priceRange: null
  });

  const priceRanges = [
    { id: 'price-1', label: '₹0 - ₹1,000', min: 0, max: 1000 },
    { id: 'price-2', label: '₹1,001 - ₹5,000', min: 1001, max: 5000 },
    { id: 'price-3', label: '₹5,001 - ₹15,000', min: 5001, max: 15000 },
    { id: 'price-4', label: '₹15,001 - ₹25,000', min: 15001, max: 25000 },
    { id: 'price-5', label: '₹25,000+', min: 25000, max: Infinity }
  ];

  const categories = categoriesData?.categories || [];
  const brands = brandsData?.brands || [];

  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const [openAccordions, setOpenAccordions] = useState({
    categories: false,
    brands: false,
    price: false
  });

  const [filtersApplied, setFiltersApplied] = useState(false);

  const toggleAccordion = (section) => {
    setOpenAccordions(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCheckboxChange = (type, value) => {
    setSelectedFilters(prev => {
      if (type === 'priceRange') {
        return {
          ...prev,
          priceRange: prev.priceRange === value ? null : value
        };
      } else {
        const array = prev[type];
        return {
          ...prev,
          [type]: array.includes(value)
            ? array.filter(item => item !== value)
            : [...array, value]
        };
      }
    });
  };

  const handleApplyFilter = () => {
    if (filtersApplied) {
      // Clear all filters
      setSelectedFilters({
        categories: [],
        brands: [],
        priceRange: null
      });
      onApplyFilters({
        categories: [],
        brands: [],
        priceRange: null
      });
      setFiltersApplied(false);
    } else {
      // Apply filters
      onApplyFilters(selectedFilters);
      setFiltersApplied(true);
    }
    
    if (window.innerWidth < 1024) {
      onClose(); // Close sidebar on mobile after applying filters
    }
  };

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
            {/* Categories Accordion */}
            <ListItem className="flex-col items-start">
              <button
                className="flex justify-between items-center w-full text-left font-medium text-gray-700 mb-2"
                onClick={() => toggleAccordion('categories')}
              >
                <span>Categories</span>
                {openAccordions.categories ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
              {openAccordions.categories && (
                <div className="space-y-2 ml-2 transition-all duration-300">
                  {categories.map((category) => (
                    <ListItemPrefix key={category._id} className="flex items-center">
                      <Checkbox
                        id={category._id}
                        color="yellow"
                        className="h-5 w-5"
                        ripple={false}
                        checked={selectedFilters.categories.includes(category._id)}
                        onChange={() => handleCheckboxChange('categories', category._id)}
                      />
                      <label htmlFor={category._id} className="ml-2 text-gray-700">
                        {category.name}
                      </label>
                    </ListItemPrefix>
                  ))}
                </div>
              )}
            </ListItem>

            {/* Brands Accordion */}
            <ListItem className="flex-col items-start">
              <button
                className="flex justify-between items-center w-full text-left font-medium text-gray-700 mb-2"
                onClick={() => toggleAccordion('brands')}
              >
                <span>Brands</span>
                {openAccordions.brands ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
              {openAccordions.brands && (
                <div className="space-y-2 ml-2 transition-all duration-300">
                  {brands.map((brand) => (
                    <div key={brand._id} className="flex items-center">
                      <Checkbox
                        id={brand._id}
                        color="yellow"
                        className="h-5 w-5"
                        ripple={false}
                        checked={selectedFilters.brands.includes(brand._id)}
                        onChange={() => handleCheckboxChange('brands', brand._id)}
                      />
                      <label htmlFor={brand._id} className="ml-2 text-gray-700">
                        {brand.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </ListItem>

            {/* Price Range Accordion */}
            <ListItem className="flex-col items-start">
              <button
                className="flex justify-between items-center w-full text-left font-medium text-gray-700 mb-2"
                onClick={() => toggleAccordion('price')}
              >
                <span>Price Range</span>
                {openAccordions.price ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
              {openAccordions.price && (
                <div className="w-full px-2 space-y-2 ml-2 transition-all duration-300">
                  {priceRanges.map((range) => (
                    <div key={range.id} className="flex items-center">
                      <Checkbox
                        id={range.id}
                        color="yellow"
                        className="h-5 w-5"
                        ripple={false}
                        checked={selectedFilters.priceRange === range.id}
                        onChange={() => handleCheckboxChange('priceRange', range.id)}
                      />
                      <label htmlFor={range.id} className="ml-2 text-gray-700">
                        {range.label}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </ListItem>
          </List>
        </div>

        <div className="p-4 border-t mt-auto">
          <button 
            onClick={handleApplyFilter}
            className={`w-full py-3 px-4 rounded-lg transition duration-300 font-medium ${
              filtersApplied 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            {filtersApplied ? 'Clear Filters' : 'Apply Filters'}
          </button>
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
};

export default FilterSidebar;
