import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Footer = () => {
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <footer className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} pt-16 pb-8 `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Information */}
          <div>
            <h3 className={`text-sm font-semibold ${currentTheme.text} uppercase tracking-wider mb-4`}>Company Information</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-yellow-500 text-sm`}>About ToolBear</Link></li>
              <li><Link to="/careers" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-yellow-500 text-sm`}>Careers</Link></li>
              <li><Link to="/press" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-yellow-500 text-sm`}>Press Releases</Link></li>
              <li><Link to="/locations" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-yellow-500 text-sm`}>Store Locations</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className={`text-sm font-semibold ${currentTheme.text} uppercase tracking-wider mb-4`}>Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/affiliate" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-yellow-500 text-sm`}>Affiliate Program</Link></li>
              <li><Link to="/guides" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-yellow-500 text-sm`}>Buying Guides</Link></li>
              <li><Link to="/sitemap" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-yellow-500 text-sm`}>Site Map</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className={`text-sm font-semibold ${currentTheme.text} uppercase tracking-wider mb-4`}>Customer Care</h3>
            <ul className="space-y-3">
              <li><Link to="/service" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-yellow-500 text-sm`}>Customer Service</Link></li>
              <li><Link to="/login" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-yellow-500 text-sm`}>Log In</Link></li>
              <li><Link to="/orders" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-yellow-500 text-sm`}>Order Status</Link></li>
              <li><Link to="/quote" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-yellow-500 text-sm`}>Request Quote</Link></li>
              <li><Link to="/faq" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-yellow-500 text-sm`}>FAQs</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className={`text-sm font-semibold ${currentTheme.text} uppercase tracking-wider mb-4`}>Policies</h3>
            <ul className="space-y-3">
              <li><Link to="/return-policy" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-yellow-500 text-sm`}>Return Policy</Link></li>
              <li><Link to="/shipping" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-yellow-500 text-sm`}>Shipping Policy</Link></li>
              <li><Link to="/privacy" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-yellow-500 text-sm`}>Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Connect with Us */}
          <div>
            <h3 className={`text-sm font-semibold ${currentTheme.text} uppercase tracking-wider mb-4`}>Connect with Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-yellow-500`}>
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-yellow-500`}>
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-yellow-500`}>
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-yellow-500`}>
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a href="#" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-yellow-500`}>
                <i className="fab fa-youtube text-xl"></i>
              </a>
            </div>

            <div>
              <h3 className={`text-sm font-semibold ${currentTheme.text} uppercase tracking-wider mb-4`}>Sign Up for Updates</h3>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  className={`w-full px-3 py-2 border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                />
                <button className={`w-full ${currentTheme.button} ${currentTheme.buttonHover} text-black px-4 py-2 rounded-md text-sm transition duration-300`}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-12 pt-8 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
            &copy; {new Date().getFullYear()} ToolBear. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;