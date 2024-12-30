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

const CouponsSection = () => {
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
      <Card className="mt-4">
        <CardBody>
          <Typography color="red">Failed to load coupons. Please try again later.</Typography>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Typography variant="h6" color="blue-gray" className="mb-4">
        Available Coupons
      </Typography>

      {data?.coupons?.map((coupon) => (
        <Card key={coupon._id} className="mb-4">
          <CardBody>
            <div className="flex justify-between items-start mb-2">
              <div>
                <Typography variant="h5" color="blue-gray">
                  {coupon.code}
                </Typography>
                <Typography color="gray" className="text-sm mb-2">
                  {coupon.description}
                </Typography>
              </div>
              <Chip
                value={`${coupon.discountType === 'percentage' ? coupon.discountAmount + '%' : '₹' + coupon.discountAmount} OFF`}
                color="green"
              />
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
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
          />
        </div>
      )}

      {data?.coupons?.length === 0 && (
        <Card>
          <CardBody>
            <Typography className="text-center">No coupons available at the moment.</Typography>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default CouponsSection;