import React from 'react';
import { Typography, Button } from '@material-tailwind/react';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { BsBoxSeam } from 'react-icons/bs';
import { MdOutlineLocalShipping } from 'react-icons/md';
import { useSelector } from 'react-redux';

const OrderCompletePage = () => {
  const navigate = useNavigate();
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <div className={`min-h-screen ${currentTheme.primary} py-8 pt-[172px]`}>
      <div className="container mx-auto px-4">
        <div className={`max-w-2xl mx-auto ${currentTheme.secondary} rounded-lg shadow-lg p-8`}>
          {/* Success Icon and Message */}
          <div className="text-center mb-8">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <Typography variant="h3" className="text-gray-900 mb-2">
              Order Placed Successfully!
            </Typography>
            <Typography className={`mb-6 ${currentTheme.textGray}`}>
              Thank you for your purchase. Your order has been confirmed.
            </Typography>
          </div>

          {/* Order Process Steps */}
          <div className="flex justify-between items-center mb-8 px-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <FaCheckCircle className="text-2xl text-green-500" />
              </div>
              <Typography variant="small" className={`text-center ${currentTheme.textGray}`}>
                Order Confirmed
              </Typography>
            </div>
            <div className="flex-1 h-1 bg-green-200 mx-2" />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <BsBoxSeam className="text-2xl text-blue-500" />
              </div>
              <Typography variant="small" className={`text-center ${currentTheme.textGray}`}>
                Processing
              </Typography>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-2" />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <MdOutlineLocalShipping className="text-2xl text-gray-500" />
              </div>
              <Typography variant="small" className={`text-center ${currentTheme.textGray}`}>
                Shipping
              </Typography>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              className={`${currentTheme.button} ${currentTheme.buttonHover} text-black`}
              onClick={() => navigate('/user/profile/orders')}
            >
              View Orders
            </Button>
            <Button
              className={`${currentTheme.button} ${currentTheme.buttonHover} text-black`}
              onClick={() => navigate('/user/all-products')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCompletePage;