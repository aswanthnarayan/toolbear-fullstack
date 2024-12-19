import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";

const SalesReportTable = ({ salesData }) => {
  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <Typography variant="h5" color="blue-gray">
          Sales Report
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-auto px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {["Order ID", "Date", "Customer", "Amount", "Discount", "Coupon", "Final Amount"].map((head) => (
                <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {salesData.map((row, index) => (
              <tr key={row.orderId} className={index % 2 === 0 ? "bg-blue-gray-50/50" : ""}>
                <td className="p-4">{row.orderId}</td>
                <td className="p-4">{row.date}</td>
                <td className="p-4">{row.customer}</td>
                <td className="p-4">₹{row.amount}</td>
                <td className="p-4">₹{row.discount}</td>
                <td className="p-4">{row.coupon}</td>
                <td className="p-4">₹{row.finalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
};

export default SalesReportTable;