import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner,
} from "@material-tailwind/react";
import { useGetAllOrdersQuery, useCancelOrderMutation } from '../../../../../App/features/rtkApis/userApi'
import { toast } from 'sonner';

const OrdersSection = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { data: orders, isLoading, error } = useGetAllOrdersQuery();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await cancelOrder(selectedOrder._id).unwrap();
      toast.success('Order cancelled successfully');
      setOpenDialog(false);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to cancel order');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'green';
      case 'processing':
      case 'shipped':
      case 'out for delivery':
        return 'blue';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
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
      <Typography color="red" className="text-center">
        Error loading orders. Please try again later.
      </Typography>
    );
  }

  return (
    <div className="space-y-6">
      <Typography variant="h4" color="blue-gray" className="mb-6">
        Your Orders
      </Typography>

      <div className="space-y-4">
        {orders?.map((order) => (
          <Card key={order._id} className="w-full">
            <CardBody>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Typography variant="h6" color="blue-gray">
                    Order #{order._id.slice(-6)}
                  </Typography>
                  <Typography color="gray" className="text-sm">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                </div>
                <Chip
                  value={order.status}
                  color={getStatusColor(order.status)}
                  size="sm"
                />
              </div>

              <div className="border-t border-b border-gray-200 py-4 my-4">
                {order.products.map((item) => (
                  <div key={item.productId._id} className="flex justify-between items-center mb-2">
                    <div>
                      <Typography color="blue-gray" className="font-medium">
                        {item.productId.name}
                      </Typography>
                      <Typography color="gray" className="text-sm">
                        Quantity: {item.quantity}
                      </Typography>
                    </div>
                    <Typography color="blue-gray">
                      ₹{item.priceAtPurchase}
                    </Typography>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <Typography color="blue-gray" className="font-medium">
                  Total
                </Typography>
                <Typography color="blue-gray" className="font-medium">
                  ₹{order.totalAmount}
                </Typography>
              </div>

              <div className="flex gap-2 mt-4">
                {order.status !== 'Cancelled' && (
                  <Button 
                    variant="outlined" 
                    color="red" 
                    size="sm"
                    onClick={() => handleCancelClick(order)}
                    disabled={['Delivered', 'Cancelled'].includes(order.status)}
                  >
                    Cancel Order
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Cancel Order Confirmation Dialog */}
      <Dialog open={openDialog} handler={() => setOpenDialog(false)}>
        <DialogHeader>Confirm Order Cancellation</DialogHeader>
        <DialogBody>
          Are you sure you want to cancel this order? This action cannot be undone.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={() => setOpenDialog(false)}
            disabled={isCancelling}
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={handleConfirmCancel}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <span>Cancelling...</span>
              </div>
            ) : (
              "Confirm Cancel"
            )}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default OrdersSection;