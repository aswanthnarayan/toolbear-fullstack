import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Chip,
  Spinner,
} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../../../App/features/rtkApis/adminApi';

const AdminSingleOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useGetOrderByIdQuery(orderId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Typography variant="h6" color="red" className="mb-4">
          {error?.data?.message || 'Failed to fetch order details'}
        </Typography>
        <Button onClick={() => navigate('/admin/orders')}>
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <Typography variant="h5" color="blue-gray">
                Order Details
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Order ID: {order?.orderId}
              </Typography>
            </div>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => navigate('/admin/orders')}
            >
              Back to Orders
            </Button>
          </div>
        </CardHeader>

        <CardBody className="px-0 pt-0">
          <div className="p-6">
            {/* Order Status */}
            <div className="mb-6">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Status
              </Typography>
              <Chip
                variant="gradient"
                color={
                  order?.status === 'Delivered' ? 'green' :
                  order?.status === 'Cancelled' ? 'red' :
                  order?.status === 'Shipped' ? 'blue' :
                  order?.status === 'Processing' ? 'yellow' :
                  'gray'
                }
                value={order?.status}
                className="text-sm w-fit px-4"
              />
            </div>

            {/* Customer Details */}
            <div className="mb-6">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Customer Information
              </Typography>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" className="font-medium">
                    Name
                  </Typography>
                  <Typography variant="small" className="text-gray-700">
                    {order?.address?.fullName}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="font-medium">
                    Phone
                  </Typography>
                  <Typography variant="small" className="text-gray-700">
                    {order?.address?.phone}
                  </Typography>
                </div>
                <div className="col-span-2">
                  <Typography variant="small" className="font-medium">
                    Address
                  </Typography>
                  <Typography variant="small" className="text-gray-700">
                    {order?.address?.street}, {order?.address?.city}, {order?.address?.state}, {order?.address?.pinCode}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Order Items
              </Typography>
              <div className="overflow-x-auto">
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          Product
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          Quantity
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          Price
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          Total
                        </Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order?.products?.map((item, index) => (
                      <tr key={index} className="even:bg-blue-gray-50/50">
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray">
                            {item.productId?.name || 'Product Unavailable'}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray">
                            {item.quantity}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray">
                            ₹{item.priceAtPurchase}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray">
                            ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                          </Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-blue-gray-50 pt-4">
              <div className="flex justify-end">
                <div className="w-80">
                  <div className="flex justify-between py-2">
                    <Typography variant="small" className="font-medium">
                      Subtotal:
                    </Typography>
                    <Typography variant="small" color="blue-gray">
                      ₹{order?.totalAmount}
                    </Typography>
                  </div>
                  <div className="flex justify-between py-2">
                    <Typography variant="small" className="font-medium">
                      Shipping:
                    </Typography>
                    <Typography variant="small" color="blue-gray">
                      Free
                    </Typography>
                  </div>
                  <div className="flex justify-between py-2 border-t border-blue-gray-50">
                    <Typography className="font-medium">
                      Total:
                    </Typography>
                    <Typography className="font-medium">
                      ₹{order?.totalAmount}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminSingleOrderPage;
export { useGetOrderByIdQuery };