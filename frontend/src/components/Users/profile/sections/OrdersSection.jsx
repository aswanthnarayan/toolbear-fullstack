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
import { 
  useGetAllOrdersQuery, 
  useCancelOrderMutation, 
  useReturnOrderMutation,
  useProcessRefundMutation 
} from '../../../../../App/features/rtkApis/userApi';
import { toast } from 'sonner';
import ReturnReasonModal from '../shared/ReturnReasonModal';
import { useNavigate } from 'react-router-dom';

const OrdersSection = () => {
  const navigate = useNavigate();
  const [cancelModal, setCancelModal] = useState(false);
  const [returnModal, setReturnModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: orders, isLoading, error } = useGetAllOrdersQuery();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [returnOrder, { isLoading: isReturning }] = useReturnOrderMutation();
  const [processRefund] = useProcessRefundMutation();

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setCancelModal(true);
  };

  const handleCancelOrder = async () => {
    try {
      // First cancel the order
      await cancelOrder(selectedOrder._id).unwrap();
      
      // Then process refund if payment method is not COD
      if (selectedOrder.paymentMethod !== 'COD') {
        try {
          await processRefund({
            orderId: selectedOrder._id,
            amount: selectedOrder.totalAmount
          }).unwrap();
          toast.success('Order cancelled and amount refunded to wallet');
        } catch (refundError) {
          console.error('Refund error:', refundError);
          toast.error('Order cancelled but refund failed. Please contact support.');
        }
      } else {
        toast.success('Order cancelled successfully');
      }
      
      setCancelModal(false);
    } catch (error) {
      console.error('Cancel error:', error);
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

      // Process refund for returned order
      try {
        await processRefund({
          orderId: selectedOrder._id,
          amount: selectedOrder.totalAmount
        }).unwrap();
        toast.success('Return request submitted and amount refunded to wallet');
      } catch (refundError) {
        console.error('Refund error:', refundError);
        toast.error('Return request submitted but refund failed. Please contact support.');
      }

      setReturnModal(false);
    } catch (error) {
      console.error('Return error:', error);
      toast.error(error.data?.message || 'Failed to submit return request');
    }
  };

  const handleCompletePayment = (order) => {
    navigate('/user/checkout/payments', { 
      state: { 
        orderId: order._id,
        fromOrders: true 
      } 
    });
  };

  const handleOrderClick = (orderId) => {
    navigate(`/user/orders/${orderId}`);
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
          <Card 
            key={order._id} 
            className="w-full cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleOrderClick(order._id)}
          >
            <CardBody>
              <div className="flex justify-between items-start">
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
                  {order.paymentStatus === 'Pending' && (
                    <Button
                      variant="gradient"
                      color="blue"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleCompletePayment(order);
                      }}
                    >
                      Complete Payment
                    </Button>
                  )}
                  {order.status !== 'Cancelled' && 
                   order.status !== 'Delivered' &&
                   !['return requested', 'return approved', 'return rejected'].includes(order.status) && (
                    <Button 
                      variant="outlined" 
                      color="red" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleCancelClick(order);
                      }}
                    >
                      Cancel Order
                    </Button>
                  )}
                  {order.status.toLowerCase() === 'delivered' && (
                    <Button
                      size="sm"
                      color="red"
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleReturnClick(order);
                      }}
                    >
                      Return Order
                    </Button>
                  )}
                </div>
              </div>
              <Typography variant="h6" className="mt-2">
                Total Amount: ₹{order.totalAmount}
              </Typography>
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