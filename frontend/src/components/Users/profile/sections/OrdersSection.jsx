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
import { useSelector } from 'react-redux';
import Pagination from '../../Pagination';

const OrdersSection = () => {
  const navigate = useNavigate();
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const [cancelModal, setCancelModal] = useState(false);
  const [returnModal, setReturnModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const { data: ordersData, isLoading, error } = useGetAllOrdersQuery(
    {
      page: currentPage,
      limit: ITEMS_PER_PAGE
    },
    {
      refetchOnMountOrArgChange: true
    }
  );
  const orders = ordersData?.orders || [];
  const totalPages = ordersData?.totalPages || 1;

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [returnOrder, { isLoading: isReturning }] = useReturnOrderMutation();
  const [processRefund] = useProcessRefundMutation();

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setCancelModal(true);
  };

  const handleCancelOrder = async () => {
    try {
      await cancelOrder(selectedOrder._id).unwrap();
      
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

  if (isLoading) {
    return (
      <div className={`min-h-[60vh] flex items-center justify-center  ${currentTheme.primary}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-[60vh] flex items-center justify-center ${currentTheme.primary}`}>
        <Typography className={currentTheme.text}>Error loading orders</Typography>
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className={`min-h-[60vh] flex items-center justify-center ${currentTheme.primary}`}>
        <Typography className={currentTheme.text}>No orders found</Typography>
      </div>
    );
  }

  return (
    <div className={`w-ful l ${currentTheme.primary}`}>
      <Typography variant="h6" className={`mb-4 ${currentTheme.text}`}>
        Order History
      </Typography>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <Card 
            key={order._id} 
            className={` cursor-pointer hover:shadow-lg transition-shadow ${currentTheme.secondary}`}
            onClick={() => handleOrderClick(order._id)}
          >
            <CardBody>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <Typography variant="h6" className={`${currentTheme.text} break-all`}>
                    Order #{order.orderId}
                  </Typography>
                  <Typography className={`text-sm ${currentTheme.textGray}`}>
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                </div>
                <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
                  <Chip
                    value={order.status}
                    color={getStatusColor(order.status)}
                    className="w-fit"
                  />
                  {order.paymentStatus === 'Pending' && order.status !== 'Cancelled' && order.paymentMethod !== 'COD' && (
                    <Button
                      className={`${currentTheme.button} ${currentTheme.buttonHover} text-black w-full sm:w-auto`}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
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
                      className="w-full sm:w-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelClick(order);
                      }}
                    >
                      Cancel Order
                    </Button>
                  )}
                  {order.status.toLowerCase() === 'delivered' && (
                    <Button
                      size="sm"
                      color="blue"
                      variant="outlined"
                      className="w-full sm:w-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReturnClick(order);
                      }}
                    >
                      Return Order
                    </Button>
                  )}
                </div>
              </div>
              <Typography variant="h6" className={`mt-4 ${currentTheme.text}`}>
                Total Amount: ₹{order.totalAmount}
              </Typography>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {!isLoading && orders.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Cancel Order Modal */}
      <Dialog 
        open={cancelModal} 
        handler={() => setCancelModal(false)}
        className={currentTheme.secondary}
      >
        <DialogHeader className={currentTheme.text}>Cancel Order</DialogHeader>
        <DialogBody className={currentTheme.text}>
          Are you sure you want to cancel this order?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            className={currentTheme.text}
            onClick={() => setCancelModal(false)}
          >
            No
          </Button>
          <Button
            className={`${currentTheme.button} ${currentTheme.buttonHover} text-black`}
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
        theme={currentTheme}
      />
    </div>
  );
};

export default OrdersSection;