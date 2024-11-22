import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../../App/features/slices/themeSlice";
import { logout } from "../../../App/features/slices/authSlice";
import { useLogOutMutation } from "../../../App/features/rtkApis/authApi";
import { persistor } from "../../../App/store";
import Logo from "../Logo";
import {
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  HeartIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);
  const [logOut] = useLogOutMutation();

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const handleCartClick = () => {
    if (!user) {
      navigate('/user/signin');
    } else {
      navigate('/user/cart');
    }
  };

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
    <div className="w-full">
      {/* Main Navbar */}
      <nav className={`w-full ${currentTheme.text} ${
        isDarkMode 
          ? currentTheme.primary
          : 'bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500'
      } shadow-lg`}>
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <Link to="/" className="flex-shrink-0">
              <Logo />
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:block flex-grow max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  className={`w-full ${currentTheme.search.bg} ${
                    currentTheme.search.text
                  } rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:${
                    currentTheme.search.ring
                  } transition-all duration-200 ${
                    isSearchFocused ? currentTheme.search.focusBg : ""
                  }`}
                  placeholder="Search for tools..."
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <button
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-500 hover:text-gray-700"
                  } transition-colors duration-200`}
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch(toggleTheme())}
                className={`${currentTheme.text} ${!isDarkMode ? 'hover:text-white' : 'hover:text-gray-300'} transition-colors duration-200`}
              >
                {isDarkMode ? (
                  <SunIcon className="w-6 h-6" />
                ) : (
                  <MoonIcon className="w-6 h-6" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCartClick}
                className={`${currentTheme.text} ${!isDarkMode ? 'hover:text-white' : 'hover:text-gray-300'} transition-colors duration-200`}
              >
                <ShoppingBagIcon className="w-6 h-6" />
              </motion.button>

              {user ? (
                <>
                  <Link to="/user/wishlist">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`${currentTheme.text} ${!isDarkMode ? 'hover:text-white' : 'hover:text-gray-300'} transition-colors duration-200`}
                    >
                      <HeartIcon className="w-6 h-6" />
                    </motion.button>
                  </Link>

                  <Menu>
                    <MenuHandler>
                      <IconButton variant="text">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`${currentTheme.text} ${!isDarkMode ? 'hover:text-white' : 'hover:text-gray-300'} transition-colors duration-200`}
                        >
                          <UserCircleIcon className="w-6 h-6" />
                        </motion.div>
                      </IconButton>
                    </MenuHandler>
                    <MenuList
                      className={`${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                      } border-none ${currentTheme.text}`}
                    >
                      <Link to="/user/profile">
                        <MenuItem>Profile</MenuItem>
                      </Link>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </MenuList>
                  </Menu>
                </>
              ) : (
                <Link to="/user/signin">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`${currentTheme.text} ${!isDarkMode ? 'hover:text-white' : 'hover:text-gray-300'} transition-colors duration-200`}
                  >
                    Sign In
                  </motion.button>
                </Link>
              )}

              
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              {/* Theme Toggle - Mobile */}
              <button
                onClick={() => dispatch(toggleTheme())}
                className={`${currentTheme.text} ${!isDarkMode ? 'hover:text-white' : 'hover:text-gray-300'} transition-colors duration-200`}
              >
                {isDarkMode ? (
                  <SunIcon className="w-6 h-6" />
                ) : (
                  <MoonIcon className="w-6 h-6" />
                )}
              </button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`${currentTheme.text} ${!isDarkMode ? 'hover:text-white' : 'hover:text-gray-300'} transition-colors duration-200`}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden w-full ${currentTheme.secondary}`}
            >
              <div className="px-4 pt-2 pb-3 space-y-1">
                {/* Mobile Search */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    className={`w-full ${currentTheme.search.bg} ${currentTheme.search.text} rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:${currentTheme.search.ring}`}
                    placeholder="Search for tools..."
                  />
                  <button
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <MagnifyingGlassIcon className="w-5 h-5" />
                  </button>
                </div>

                <button
                  className={`flex items-center space-x-3 ${currentTheme.text} w-full px-3 py-2 rounded-md text-base ${currentTheme.hover}`}
                  onClick={handleCartClick}
                >
                  <ShoppingBagIcon className="w-5 h-5" />
                  <span>Cart</span>
                </button>

                {user ? (
                  <>
                    <Link to="/user/wishlist">
                      <button
                        className={`flex items-center space-x-3 ${currentTheme.text} w-full px-3 py-2 rounded-md text-base ${currentTheme.hover}`}
                      >
                        <HeartIcon className="w-5 h-5" />
                        <span>Wishlist</span>
                      </button>
                    </Link>

                    <Link to="/user/profile">
                      <button
                        className={`flex items-center space-x-3 ${currentTheme.text} w-full px-3 py-2 rounded-md text-base ${currentTheme.hover}`}
                      >
                        <UserCircleIcon className="w-5 h-5" />
                        <span>Profile</span>
                      </button>
                    </Link>

                    <button
                      className={`flex items-center space-x-3 ${currentTheme.text} w-full px-3 py-2 rounded-md text-base ${currentTheme.hover}`}
                      onClick={handleLogout}
                    >
                      <UserCircleIcon className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link to="/user/signin">
                    <button
                      className={`flex items-center space-x-3 ${currentTheme.text} w-full px-3 py-2 rounded-md text-base ${currentTheme.hover}`}
                    >
                      <UserCircleIcon className="w-5 h-5" />
                      <span>Sign In</span>
                    </button>
                  </Link>
                )}

                
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Secondary Navigation */}
      <nav
        className={`${currentTheme.secondary} ${currentTheme.text} shadow-lg w-full`}
      >
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 h-12 text-sm font-medium overflow-x-auto">
            <Link
              to="user/products"
              className="hover:text-blue-400 transition-colors duration-200 whitespace-nowrap"
            >
              ALL PRODUCTS
            </Link>
            <Link
              to="/user/deals"
              className="hover:text-blue-400 transition-colors duration-200 whitespace-nowrap"
            >
              DEALS
            </Link>
            <Link
              to="/user/categories"
              className="hover:text-blue-400 tr5ansition-colors duration-200 whitespace-nowrap"
            >
              CATEGORIES
            </Link>
            <Link
              to="/user/brands"
              className="hover:text-blue-400 transition-colors duration-200 whitespace-nowrap"
            >
              BRANDS
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
