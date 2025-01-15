import React from 'react';
import { Typography, Button } from '@material-tailwind/react';
import { FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const OrderPaymentFailPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <div className={`min-h-screen ${currentTheme.primary} py-8 pt-[172px]`}>
      <div className="container mx-auto px-4">
        <div className={`max-w-2xl mx-auto ${currentTheme.secondary} rounded-lg shadow-lg p-8`}>
          {/* Failure Icon and Message */}
          <div className="text-center mb-8">
            <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <Typography variant="h3" className="text-gray-900 mb-2">
              Payment Failed
            </Typography>
            <Typography className={`mb-6 ${currentTheme.textGray}`}>
              Your payment was not completed. You can complete the payment for this order through your order history.
            </Typography>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Button
              className={`${currentTheme.button} ${currentTheme.buttonHover} text-black`}
              onClick={() => navigate('/user/profile/orders')}
            >
              Go to Orders
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPaymentFailPage;