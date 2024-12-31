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
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className={`mt-4 ${currentTheme.secondary}`}>
        <CardBody>
          <Typography className="text-red-500">
            Failed to load coupons. Please try again later.
          </Typography>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${currentTheme.primary}`}>
      <Typography variant="h6" className={`mb-4 ${currentTheme.text}`}>
        Available Coupons
      </Typography>

      {data?.coupons?.map((coupon) => (
        <Card key={coupon._id} className={`mb-4 ${currentTheme.secondary} hover:shadow-lg transition-shadow duration-300`}>
          <CardBody>
            <div className="flex justify-between items-start mb-2">
              <div>
                <Typography variant="h5" className={currentTheme.text}>
                  {coupon.code}
                </Typography>
                <Typography className={`text-sm mb-2 ${currentTheme.textGray}`}>
                  {coupon.description}
                </Typography>
              </div>
              <Chip
                value={`${coupon.discountType === 'percentage' ? coupon.discountAmount + '%' : '₹' + coupon.discountAmount} OFF`}
                color="green"
              />
            </div>
            <div className={`flex justify-between items-center text-sm ${currentTheme.textGray}`}>
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
        <div className="mt-4">
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
      )}

      {data?.coupons?.length === 0 && (
        <Card className={currentTheme.secondary}>
          <CardBody>
            <Typography className={`text-center ${currentTheme.text}`}>
              No coupons available at the moment.
            </Typography>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default CouponsSection;