import React from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Chip,
} from "@material-tailwind/react";
import {
  TicketIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

const CouponsSection = () => {
  const coupons = [
    {
      id: 1,
      code: 'TOOL20',
      discount: '20% OFF',
      description: 'Get 20% off on all power tools',
      minPurchase: 1000,
      validUntil: '2024-01-31',
      isActive: true,
    },
    {
      id: 2,
      code: 'FESTIVE50',
      discount: '₹50 OFF',
      description: 'Flat ₹50 off on purchases above ₹500',
      minPurchase: 500,
      validUntil: '2023-12-31',
      isActive: true,
    },
    {
      id: 3,
      code: 'BUNDLE30',
      discount: '30% OFF',
      description: 'Get 30% off on tool bundles',
      minPurchase: 2000,
      validUntil: '2023-12-15',
      isActive: false,
    },
  ];

  return (
    <div className="space-y-6">
      <Typography variant="h4" color="blue-gray" className="mb-6">
        My Coupons
      </Typography>

      <Card className="mb-6">
        <CardBody>
          <Typography variant="h6" color="blue-gray" className="mb-4">
            Have a Coupon Code?
          </Typography>
          <div className="flex gap-2">
            <Input
              label="Enter Coupon Code"
              className="flex-grow"
            />
            <Button>Apply</Button>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4">
        {coupons.map((coupon) => (
          <Card key={coupon.id} className={!coupon.isActive ? 'opacity-60' : ''}>
            <CardBody>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <TicketIcon className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Typography variant="h6" color="blue-gray">
                        {coupon.discount}
                      </Typography>
                      <Chip
                        value={coupon.code}
                        className="bg-blue-gray-50 text-blue-gray-900"
                      />
                    </div>
                    <Typography color="gray">
                      {coupon.description}
                    </Typography>
                    <Typography color="gray" className="text-sm mt-2">
                      Min. Purchase: ₹{coupon.minPurchase}
                    </Typography>
                  </div>
                </div>
                <div className="text-right">
                  {coupon.isActive ? (
                    <div className="flex items-center gap-1 text-green-500">
                      <CheckCircleIcon className="h-4 w-4" />
                      <Typography variant="small">Active</Typography>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-500">
                      <ClockIcon className="h-4 w-4" />
                      <Typography variant="small">Expired</Typography>
                    </div>
                  )}
                  <Typography color="gray" className="text-sm mt-2">
                    Valid until: {new Date(coupon.validUntil).toLocaleDateString()}
                  </Typography>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CouponsSection;