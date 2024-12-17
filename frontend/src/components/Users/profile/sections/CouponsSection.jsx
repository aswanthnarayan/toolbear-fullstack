import React from 'react';
import {
  Typography,
  Card,
  CardBody,
  Chip,
  Spinner
} from "@material-tailwind/react";
import { useGetAvailableCouponsQuery } from '../../../../../App/features/rtkApis/userApi';

const CouponsSection = () => {
  const { data: coupons, isLoading, error } = useGetAvailableCouponsQuery();

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
    <div>
      <Typography variant="h6" color="blue-gray" className="mb-4">
        Available Coupons
      </Typography>

      <div className="grid gap-4">
        {!coupons || coupons.length === 0 ? (
          <Card>
            <CardBody>
              <Typography>No coupons available at the moment.</Typography>
            </CardBody>
          </Card>
        ) : (
          coupons.map((coupon) => (
            <Card key={coupon._id} className="hover:shadow-lg transition-shadow">
              <CardBody>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Typography variant="h6" color="blue-gray" className="font-bold">
                      {coupon.code}
                    </Typography>
                    <Typography variant="small" color="gray" className="font-normal">
                      {coupon.description}
                    </Typography>
                  </div>
                  <Chip
                    size="sm"
                    variant="gradient"
                    value={coupon.discountType === 'percentage' ? `${coupon.discountAmount}% OFF` : `₹${coupon.discountAmount} OFF`}
                    color="green"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <Typography variant="small" color="gray" className="font-semibold">
                      Min. Purchase
                    </Typography>
                    <Typography variant="small" className="font-normal">
                      ₹{coupon.minimumPurchase}
                    </Typography>
                  </div>
                  {coupon.maxDiscount > 0 && (
                    <div>
                      <Typography variant="small" color="gray" className="font-semibold">
                        Max Discount
                      </Typography>
                      <Typography variant="small" className="font-normal">
                        ₹{coupon.maxDiscount}
                      </Typography>
                    </div>
                  )}
                  <div className="col-span-2">
                    <Typography variant="small" color="gray" className="font-semibold">
                      Valid Till
                    </Typography>
                    <Typography variant="small" className="font-normal">
                      {formatDate(coupon.expiryDate)}
                    </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CouponsSection;