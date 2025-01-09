import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Chip,
  Spinner,
  List,
  ListItem,
} from "@material-tailwind/react";
import { 
  useGetOrderByIdQuery,
  useDownloadInvoiceMutation 
} from '../../../App/features/rtkApis/userApi';
import { toast } from 'sonner';
import { FaFileInvoice } from "react-icons/fa";
import { useSelector } from 'react-redux';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  
  const { data: order, isLoading } = useGetOrderByIdQuery(orderId);
  const [downloadInvoice, { isLoading: isDownloading }] = useDownloadInvoiceMutation();
  

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
  
  

  const handleCompletePayment = () => {
    navigate('/user/checkout/payments', { 
      state: { 
        orderId: order._id,
        fromOrders: true 
      } 
    });
  };

  const handleDownloadInvoice = async () => {
    try {
      const blob = await downloadInvoice(orderId).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download invoice');
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner />
    </div>
  );

  if (!order) return (
    <div className={`flex justify-center items-center min-h-screen ${currentTheme.primary}`}>
      <Typography className={currentTheme.text}>Order not found</Typography>
    </div>
  );

  return (
    <div className={`min-h-screen ${currentTheme.primary}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-[112px]">
        <Button
          className={`mb-4 ${currentTheme.button} ${currentTheme.buttonHover} text-black`}
          onClick={() => navigate('/user/profile/orders')}
        >
          ← Back to Orders
        </Button>

        <Card className={currentTheme.secondary}>
          <CardBody>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
              <div>
                <Typography variant="h4" className={`mb-2 text-2xl md:text-3xl ${currentTheme.text}`}>
                  Order Details
                </Typography>
                <Typography variant="h6" className={`mb-1 text-sm md:text-base ${currentTheme.textGray}`}>
                  Order #{order.orderId}
                </Typography>
                <Typography className={`text-sm md:text-base ${currentTheme.textGray}`}>
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </Typography>
              </div>
              <div className="flex flex-col gap-2 items-start md:items-end w-full md:w-auto">
                <div className="flex gap-2 flex-wrap justify-start md:justify-end w-full md:w-auto">
                  <Chip
                    value={order.status}
                    color={getStatusColor(order.status)}
                    size="lg"
                    className="text-sm md:text-base"
                  />
                  <Chip
                    value={order.paymentStatus}
                    color={order.paymentStatus === 'Paid' ? 'green' : 'amber'}
                    size="lg"
                    className="text-sm md:text-base"
                  />
                </div>
                <div className="flex gap-2 flex-wrap w-full md:w-auto">
                  {order.paymentStatus === 'Pending' && (
                    <Button
                      className={`w-full md:w-auto ${currentTheme.button} ${currentTheme.buttonHover} text-black`}
                      onClick={handleCompletePayment}
                    >
                      Complete Payment
                    </Button>
                  )}
                  {order.paymentStatus === 'Paid' && (
                    <Button
                      className={`flex items-center gap-2 w-full md:w-auto ${currentTheme.button} ${currentTheme.buttonHover} text-black`}
                      onClick={handleDownloadInvoice}
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <FaFileInvoice className="h-4 w-4" />
                      )}
                      {isDownloading ? 'Downloading...' : 'Download Invoice'}
                    </Button>
                  )}
                </div>
              </div>
            </div>

              {/* Order Items */}
              <Card className={` ${currentTheme.secondary} shadow-md`}>
              <CardBody className="p-4">
                <Typography variant="h6" className={`mb-4 text-lg ${currentTheme.text}`}>
                  Order Items
                </Typography>
                <div className="space-y-4">
                  {order.products.map((item) => (
                    <div key={item.productId._id} 
                         className={`flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b last:border-b-0 gap-4 ${currentTheme.hover}`}>
                      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <img
                          src={item.productId.mainImage.imageUrl}
                          alt={item.productId.name}
                          className="h-24 w-24 object-cover rounded"
                        />
                        <div>
                          <Typography variant="h6" className={`text-base md:text-lg ${currentTheme.text}`}>
                            {item.productId.name}
                          </Typography>
                          <Typography className={`text-sm md:text-base ${currentTheme.textGray}`}>
                            Quantity: {item.quantity}
                          </Typography>
                          <Typography className={`text-sm md:text-base ${currentTheme.textGray}`}>
                            Price: ₹{item.priceAtPurchase}
                          </Typography>
                        </div>
                      </div>
                      <Typography variant="h6" className={`text-base md:text-lg ml-auto ${currentTheme.text}`}>
                        ₹{item.priceAtPurchase * item.quantity}
                      </Typography>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Grid Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6">
              {/* Shipping Address */}
              <Card className={`${currentTheme.secondary} shadow-md`}>
                <CardBody className="p-4">
                  <Typography variant="h6" className={`mb-4 text-lg ${currentTheme.text}`}>
                    Shipping Address
                  </Typography>
                  <Typography className={`mb-1 text-sm md:text-base ${currentTheme.text}`}>{order.address.fullName}</Typography>
                  <Typography className={`mb-1 text-sm md:text-base ${currentTheme.text}`}>{order.address.phone}</Typography>
                  <Typography className={`mb-1 text-sm md:text-base ${currentTheme.text}`}>{order.address.address}</Typography>
                  <Typography className={`mb-1 text-sm md:text-base ${currentTheme.text}`}>
                    {order.address.city}, {order.address.state} {order.address.pincode}
                  </Typography>
                </CardBody>
              </Card>

              {/* Payment Information */}
              <Card className={`${currentTheme.secondary} shadow-md`}>
                <CardBody className="p-4">
                  <Typography variant="h6" className={`mb-4 text-lg ${currentTheme.text}`}>
                    Payment Information
                  </Typography>
                  <List className="p-0">
                    <ListItem className={`flex justify-between py-2 ${currentTheme.text}`}>
                      <span className="text-sm md:text-base">Payment Method</span>
                      <span className="text-sm md:text-base">{order.paymentMethod}</span>
                    </ListItem>
                    <ListItem className={`flex justify-between py-2 ${currentTheme.text}`}>
                      <span className="text-sm md:text-base">Payment Status</span>
                      <span className="text-sm md:text-base">{order.paymentStatus}</span>
                    </ListItem>
                    <ListItem className={`flex justify-between py-2 ${currentTheme.text}`}>
                      <span className="text-sm md:text-base">Original Price</span>
                      <span className="text-sm md:text-base">₹{order.totalAmount + order.discountAmount}</span>
                    </ListItem>
                    {order.couponCode && (
                      <ListItem className={`flex justify-between py-2 ${currentTheme.text}`}>
                        <span className="text-sm md:text-base">Applied Coupon</span>
                        <span className="text-sm md:text-base">{order.couponCode}</span>
                      </ListItem>
                    )}
                    {order.discountAmount > 0 && (
                      <ListItem className={`flex justify-between py-2 ${currentTheme.text}`}>
                        <span className="text-sm md:text-base">Coupon Discount</span>
                        <span className="text-sm md:text-base text-green-500">-₹{order.discountAmount}</span>
                      </ListItem>
                    )}
                    <ListItem className={`flex justify-between py-2 ${currentTheme.text}`}>
                      <span className="text-sm md:text-base">Shipping</span>
                      <span className="text-sm md:text-base">₹{order.shippingAmount}</span>
                    </ListItem>
                    <ListItem className={`flex justify-between py-2 font-bold ${currentTheme.text}`}>
                      <span className="text-sm md:text-base">Final Amount</span>
                      <span className="text-sm md:text-base">₹{order.totalAmount}</span>
                    </ListItem>
                  </List>
                </CardBody>
              </Card>
            </div>

          
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailsPage;