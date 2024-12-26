import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Card,
  CardBody,
  Typography,
  Radio,
  Button,
  Spinner,
  List,
  ListItem,
  ListItemPrefix
} from "@material-tailwind/react";
import { 
  useGetOrderByIdQuery,
  useCreateRazorpayOrderMutation,
  useCompletePaymentMutation
} from '../../../App/features/rtkApis/userApi';
import { toast } from 'sonner';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const PurchasePaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Get orderId from either location state or search params
  const orderId = location.state?.orderId || searchParams.get('orderId');
  const fromOrders = location.state?.fromOrders || false;
  
  const { data: order, isLoading: isLoadingOrder, error: orderError } = useGetOrderByIdQuery(orderId, {
    skip: !orderId
  });
  
  console.log('Order:', order); // Debug order data
  console.log('Order Error:', orderError); // Debug any errors

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('RAZORPAY'); // Default to Razorpay for pending payments
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [completePayment] = useCompletePaymentMutation();

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  useEffect(() => {
    if (!orderId) {
      toast.error('No order found');
      navigate(fromOrders ? '/user/profile/orders' : '/user/cart');
    }
  }, [orderId, navigate, fromOrders]);

  // After successful payment
  const handleSuccessfulPayment = () => {
    toast.success('Payment completed successfully!');
    navigate(fromOrders ? '/user/checkout/success':'/user/profile/orders'  );
  };

  const handlePayment = async () => {
    try {
      if (selectedPaymentMethod === 'COD') {
        const result = await completePayment({
          orderId,
          paymentMethod: 'COD'
        }).unwrap();

        if (result.message === "Order already processed") {
          toast.info('Order is already processed');
        } else {
          toast.success('Order placed successfully!');
        }
        handleSuccessfulPayment();
      } else {
        console.log('Creating Razorpay order...');
        const razorpayResponse = await createRazorpayOrder({
          amount: order.totalAmount * 100
        }).unwrap();
        console.log('Razorpay order created:', razorpayResponse);

        if (!window.Razorpay) {
          toast.error('Razorpay not loaded. Please try again.');
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.totalAmount * 100,
          currency: "INR",
          name: "Tool Purchase",
          description: "Tool Purchase",
          order_id: razorpayResponse.order.id,
          handler: async function (response) {
            const result = await completePayment({
              orderId,
              paymentMethod: 'RAZORPAY',
              paymentDetails: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }
            }).unwrap();

            if (result.message === "Order already processed") {
              toast.info('Order is already processed');
            } else {
              toast.success('Payment successful!');
            }
            handleSuccessfulPayment();
          },
          prefill: {
            name: order?.address?.name || "",
            contact: order?.address?.mobile || ""
          },
          theme: {
            color: "#3399cc"
          }
        };

        console.log('Opening Razorpay with options:', options);
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.data?.error || 'Payment failed');
    }
  };

  if (isLoadingOrder) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-[132px]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardBody className="p-6">
              <Typography variant="h5" className="mb-6">Order Summary</Typography>
              
              {/* Products List */}
              <List>
                {order?.products.map((item) => (
                  <ListItem key={item.productId._id} className="py-4">
                    <ListItemPrefix>
                      <img 
                        src={item.productId.additionalImages[0].imageUrl} 
                        alt={item.productId.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                    </ListItemPrefix>
                    <div className="flex flex-col flex-1 ml-4">
                      <Typography variant="h6">{item.productId.name}</Typography>
                      <Typography color="gray" className="text-sm">
                        Quantity: {item.quantity} × ₹{item.priceAtPurchase}
                      </Typography>
                      <Typography className="font-semibold mt-1">
                        ₹{item.quantity * item.priceAtPurchase}
                      </Typography>
                    </div>
                  </ListItem>
                ))}
              </List>

              {/* Price Breakdown */}
              <div className="border-t mt-4 pt-4 space-y-2">
                <div className="flex justify-between">
                  <Typography>Subtotal:</Typography>
                  <Typography>₹{(order?.totalAmount - (order?.shippingAmount || 0))}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography>Shipping:</Typography>
                  <Typography>₹{order?.shippingAmount || 0}</Typography>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <Typography>Total:</Typography>
                  <Typography>₹{(order?.totalAmount )}</Typography>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mt-6 border-t pt-4">
                <Typography variant="h6" className="mb-2">Delivery Address</Typography>
                <div className="bg-gray-50 p-4 rounded">
                  <Typography>{order?.address.name}</Typography>
                  <Typography className="text-sm text-gray-600">
                    {order?.address.street}, {order?.address.city}
                    <br />
                    {order?.address.state}, {order?.address.pinCode}
                    <br />
                    Phone: {order?.address.mobile}
                  </Typography>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Payment Method Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardBody className="p-6">
              <Typography variant="h5" className="mb-6">Select Payment Method</Typography>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3 p-4 border rounded-lg">
                  <Radio
                    name="payment"
                    color="blue"
                    checked={selectedPaymentMethod === 'COD'}
                    onChange={() => setSelectedPaymentMethod('COD')}
                    disabled={order?.totalAmount < 1000}
                  />
                  <div>
                    <Typography variant="h6">Cash on Delivery</Typography>
                    <Typography variant="small" color="gray">Pay when you receive the tools</Typography>
                    {order?.totalAmount < 1000 && (
                      <Typography variant="small" color="red" className="mt-1">
                        COD available only on orders above ₹1,000
                      </Typography>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 border rounded-lg">
                  <Radio
                    name="payment"
                    color="blue"
                    checked={selectedPaymentMethod === 'RAZORPAY'}
                    onChange={() => setSelectedPaymentMethod('RAZORPAY')}
                  />
                  <div>
                    <Typography variant="h6">Online Payment</Typography>
                    <Typography variant="small" color="gray">Pay securely with Razorpay</Typography>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-4">
                  <Typography>Amount to Pay:</Typography>
                  <Typography variant="h6">₹{order?.totalAmount || 0}</Typography>
                </div>

                <Button
                  color="blue"
                  size="lg"
                  fullWidth
                  onClick={handlePayment}
                >
                  Proceed to Pay
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PurchasePaymentPage;