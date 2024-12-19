import React from 'react';
import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";

const DashboardCard = ({ icon: Icon, title, value, bgColor, iconColor }) => {
  return (
    <Card className="bg-white shadow-lg">
      <CardBody className="flex items-center gap-4">
        <div className={`rounded-full p-3 ${bgColor}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <Typography variant="h6" color="blue-gray">
            {title}
          </Typography>
          <Typography variant="h4">
            {value}
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
};

export default DashboardCard;