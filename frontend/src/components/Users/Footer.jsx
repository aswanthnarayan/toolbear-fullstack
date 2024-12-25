import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Company Information</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-600 hover:text-red-500 text-sm">About ToolBear</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-red-500 text-sm">Careers</Link></li>
              <li><Link to="/press" className="text-gray-600 hover:text-red-500 text-sm">Press Releases</Link></li>
              <li><Link to="/locations" className="text-gray-600 hover:text-red-500 text-sm">Store Locations</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/affiliate" className="text-gray-600 hover:text-red-500 text-sm">Affiliate Program</Link></li>
              <li><Link to="/guides" className="text-gray-600 hover:text-red-500 text-sm">Buying Guides</Link></li>
              <li><Link to="/sitemap" className="text-gray-600 hover:text-red-500 text-sm">Site Map</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Customer Care</h3>
            <ul className="space-y-3">
              <li><Link to="/service" className="text-gray-600 hover:text-red-500 text-sm">Customer Service</Link></li>
              <li><Link to="/login" className="text-gray-600 hover:text-red-500 text-sm">Log In</Link></li>
              <li><Link to="/orders" className="text-gray-600 hover:text-red-500 text-sm">Order Status</Link></li>
              <li><Link to="/quote" className="text-gray-600 hover:text-red-500 text-sm">Request Quote</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-red-500 text-sm">FAQs</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Policies</h3>
            <ul className="space-y-3">
              <li><Link to="/return-policy" className="text-gray-600 hover:text-red-500 text-sm">Return Policy</Link></li>
              <li><Link to="/shipping" className="text-gray-600 hover:text-red-500 text-sm">Shipping Policy</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-red-500 text-sm">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Connect with Us */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Connect with Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="text-gray-600 hover:text-red-500">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-red-500">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-red-500">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-red-500">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-red-500">
                <i className="fab fa-youtube text-xl"></i>
              </a>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Sign Up for Updates</h3>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button className="w-full bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition duration-300">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ToolBear. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;