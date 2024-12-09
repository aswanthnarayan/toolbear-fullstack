import React from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Chip,
} from "@material-tailwind/react";

const OrdersSection = () => {
  const orders = [
    {
      id: '#ORD123456',
      date: '2023-12-07',
      status: 'Delivered',
      total: 299.99,
      items: [
        { name: 'Power Tool Set', quantity: 1, price: 299.99 }
      ]
    },
    {
      id: '#ORD123457',
      date: '2023-12-05',
      status: 'Processing',
      total: 149.99,
      items: [
        { name: 'Hand Tools Bundle', quantity: 2, price: 74.99 }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'green';
      case 'processing':
        return 'blue';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      <Typography variant="h4" color="blue-gray" className="mb-6">
        Your Orders
      </Typography>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="w-full">
            <CardBody>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Typography variant="h6" color="blue-gray">
                    Order {order.id}
                  </Typography>
                  <Typography color="gray" className="text-sm">
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </Typography>
                </div>
                <Chip
                  value={order.status}
                  color={getStatusColor(order.status)}
                  size="sm"
                />
              </div>

              <div className="border-t border-b border-gray-200 py-4 my-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <Typography color="blue-gray" className="font-medium">
                        {item.name}
                      </Typography>
                      <Typography color="gray" className="text-sm">
                        Quantity: {item.quantity}
                      </Typography>
                    </div>
                    <Typography color="blue-gray">
                      ${item.price.toFixed(2)}
                    </Typography>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <Typography color="blue-gray" className="font-medium">
                  Total
                </Typography>
                <Typography color="blue-gray" className="font-medium">
                  ${order.total.toFixed(2)}
                </Typography>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outlined" size="sm">
                  View Details
                </Button>
                <Button variant="outlined" size="sm" color="blue-gray">
                  Track Order
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrdersSection;