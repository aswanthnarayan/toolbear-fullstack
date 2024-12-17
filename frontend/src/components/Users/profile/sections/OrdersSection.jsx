import React, { useState } from 'react';
import {
  Typography,
  Button,
  Card,
  CardBody,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner,
} from "@material-tailwind/react";
import { useGetAllOrdersQuery, useCancelOrderMutation, useReturnOrderMutation } from '../../../../../App/features/rtkApis/userApi';
import { toast } from 'sonner';
import ReturnReasonModal from '../shared/ReturnReasonModal';

const OrdersSection = () => {
  const [cancelModal, setCancelModal] = useState(false);
  const [returnModal, setReturnModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: orders, isLoading, error } = useGetAllOrdersQuery();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [returnOrder, { isLoading: isReturning }] = useReturnOrderMutation();

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setCancelModal(true);
  };

  const handleCancelOrder = async () => {
    try {
      await cancelOrder(selectedOrder._id).unwrap();
      setCancelModal(false);
      toast.success('Order cancelled successfully');
    } catch (error) {
      toast.error(error.data?.message || 'Failed to cancel order');
    }
  };

  const handleReturnClick = (order) => {
    setSelectedOrder(order);
    setReturnModal(true);
  };

  const handleReturnSubmit = async (reason) => {
    try {
      await returnOrder({
        orderId: selectedOrder._id,
        reason
      }).unwrap();
      setReturnModal(false);
      toast.success('Return request submitted successfully');
    } catch (error) {
      toast.error(error.data?.message || 'Failed to submit return request');
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
      case 'return requested':
        return 'amber';
      case 'return approved':
        return 'purple';
      case 'return rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  if (isLoading) return <div className="flex justify-center"><Spinner /></div>;
  if (error) return <div>Error loading orders</div>;
  if (!orders?.length) return <div>No orders found</div>;

  return (
    <div className="w-full">
      <Typography variant="h6" color="blue-gray" className="mb-4">
        Order History
      </Typography>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order._id} className="w-full">
            <CardBody>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Typography variant="h6" color="blue-gray">
                    Order #{order._id}
                  </Typography>
                  <Typography color="gray" className="text-sm">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                </div>
                <div className="flex gap-2 items-center">
                  <Chip
                    value={order.status}
                    color={getStatusColor(order.status)}
                  />
                  {order.status !== 'Cancelled' && 
                   !['return requested', 'return approved', 'return rejected'].includes(order.status) && (
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
                  {order.status.toLowerCase() === 'delivered' && (
                    <Button
                      size="sm"
                      color="red"
                      variant="outlined"
                      onClick={() => handleReturnClick(order)}
                    >
                      Return Order
                    </Button>
                  )}
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-4 my-4">
                {order.products.map((item) => (
                  <div key={item.productId._id} className="flex justify-between items-center mb-2">
                    <div className="flex gap-4">
                      <img
                        src={item.productId.mainImage.imageUrl}
                        alt={item.productId.name}
                        className="h-20 w-20 object-cover rounded"
                      />
                      <div>
                        <Typography variant="h6">{item.productId.name}</Typography>
                        <Typography color="gray" className="text-sm">
                          Quantity: {item.quantity}
                        </Typography>
                      </div>
                    </div>
                    <Typography variant="h6">₹{item.priceAtPurchase}</Typography>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <Typography variant="h6">Total Amount:</Typography>
                <Typography variant="h6">
                  ₹{order.totalAmount}
                </Typography>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Cancel Order Modal */}
      <Dialog open={cancelModal} handler={() => setCancelModal(false)}>
        <DialogHeader>Cancel Order</DialogHeader>
        <DialogBody>
          Are you sure you want to cancel this order?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={() => setCancelModal(false)}
            className="mr-1"
          >
            No
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={handleCancelOrder}
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelling..." : "Yes, Cancel Order"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Return Order Modal */}
      <ReturnReasonModal
        open={returnModal}
        handleOpen={() => setReturnModal(false)}
        onSubmit={handleReturnSubmit}
        isLoading={isReturning}
      />
    </div>
  );
};

export default OrdersSection;