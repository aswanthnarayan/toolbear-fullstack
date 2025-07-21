import React, { useState } from 'react';
import {
  Typography,
  Card,
  CardBody,
  Chip,
  Spinner
} from "@material-tailwind/react";
import { useGetAvailableCouponsQuery } from '../../../../../App/features/rtkApis/userApi';
import Pagination from '../../Pagination';
import { useSelector } from 'react-redux';

const CouponsSection = () => {
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetAvailableCouponsQuery({ 
    page, 
    limit: 5 
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className={`${currentTheme.secondary}`}>
        <CardBody className="p-4">
          <Typography className="text-red-500 text-sm sm:text-base text-center">
            Failed to load coupons. Please try again later.
          </Typography>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${currentTheme.primary}`}>
      <Typography variant="h6" className={`mb-4 text-lg sm:text-xl ${currentTheme.text}`}>
        Available Coupons
      </Typography>

      {data?.coupons?.map((coupon) => (
        <Card key={coupon._id} className={`${currentTheme.secondary} hover:shadow-lg transition-shadow duration-300`}>
          <CardBody className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <Typography variant="h5" className={`${currentTheme.text} text-base sm:text-lg break-all mb-1`}>
                  {coupon.code}
                </Typography>
                <Typography className={`text-xs sm:text-sm ${currentTheme.textGray}`}>
                  {coupon.description}
                </Typography>
              </div>
              <Chip
                value={`${coupon.discountType === 'percentage' ? coupon.discountAmount + '%' : '₹' + coupon.discountAmount} OFF`}
                color="green"
                className="text-xs sm:text-sm h-6 sm:h-7"
              />
            </div>
            <div className={`flex flex-col sm:flex-row justify-between gap-1 sm:gap-4 text-xs sm:text-sm ${currentTheme.textGray}`}>
              <div>
                Min. Purchase: ₹{coupon.minimumPurchase}
              </div>
              <div>
                Expires: {formatDate(coupon.expiryDate)}
              </div>
            </div>
          </CardBody>
        </Card>
      ))}

      {/* Pagination */}
      {data?.coupons?.length > 0 && (
        <div className="mt-4 sm:mt-6 w-full overflow-x-auto">
          <div className="min-w-[300px] max-w-full mx-auto pb-2">
            <Pagination
              currentPage={page}
              totalPages={data?.pagination?.totalPages}
              onPageChange={(newPage) => {
                setPage(newPage);
                window.scrollTo(0, 0);
              }}
              theme={currentTheme}
            />
          </div>
        </div>
      )}

      {data?.coupons?.length === 0 && (
        <Card className={currentTheme.secondary}>
          <CardBody className="p-4">
            <Typography className={`text-center text-sm sm:text-base ${currentTheme.text}`}>
              No coupons available at the moment.
            </Typography>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default CouponsSection;