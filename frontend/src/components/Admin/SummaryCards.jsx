import React from "react";
import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { 
  ShoppingCartIcon,
  CurrencyRupeeIcon,
  TagIcon 
} from "@heroicons/react/24/solid";

export function SummaryCards({ summaryData }) {
  const cards = [
    {
      title: "Overall Sales Count",
      value: summaryData.totalSales,
      icon: <ShoppingCartIcon className="h-6 w-6 text-blue-500" />,
      bgColor: "bg-blue-100"
    },
    {
      title: "Overall Order Amount",
      value: `₹${summaryData.totalAmount}`,
      icon: <CurrencyRupeeIcon className="h-6 w-6 text-green-500" />,
      bgColor: "bg-green-100"
    },
    {
      title: "Overall Discount",
      value: `₹${summaryData.totalDiscount}`,
      icon: <TagIcon className="h-6 w-6 text-orange-500" />,
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className="bg-white shadow-lg">
          <CardBody className="flex items-center gap-4">
            <div className={`rounded-full p-3 ${card.bgColor}`}>
              {card.icon}
            </div>
            <div>
              <Typography variant="h6" color="blue-gray">
                {card.title}
              </Typography>
              <Typography variant="h4">
                {card.value}
              </Typography>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}