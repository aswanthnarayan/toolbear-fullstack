import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Typography,
  Radio,
  Button,
  List,
  ListItem,
  ListItemPrefix,
  Alert
} from "@material-tailwind/react";
import { 
  useGetOrderByIdQuery,
  useCreateRazorpayOrderMutation,
  useCompletePaymentMutation,
  useGetWalletQuery
} from '../../../App/features/rtkApis/userApi';
import { toast } from 'sonner';
import CustomSpinner from '../../components/utils/CustomSpinner';

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
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  
  // Get orderId from either location state or search params
  const orderId = location.state?.orderId || searchParams.get('orderId');
  const fromOrders = location.state?.fromOrders || false;
  
  const { data: order, isLoading: isLoadingOrder, error: orderError } = useGetOrderByIdQuery(orderId, {
    skip: !orderId
  });
  
  // console.log('Order:', order); // Debug order data
  // console.log('Order Error:', orderError); // Debug any errors

  const { data: wallet } = useGetWalletQuery({ page: 1, limit: 1 });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('RAZORPAY'); // Default to Razorpay for pending payments
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [completePayment] = useCompletePaymentMutation();

  const insufficientWalletBalance = wallet?.balance < (order?.totalAmount || 0);

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
    navigate('/user/checkout/success');
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
      } else if (selectedPaymentMethod === 'WALLET') {
        // Handle wallet payment
        const result = await completePayment({
          orderId,
          paymentMethod: 'WALLET'
        }).unwrap();

        if (result.message === "Order already processed") {
          toast.info('Order is already processed');
        } else {
          toast.success('Payment successful using wallet balance!');
        }
        handleSuccessfulPayment();
      } else {
        console.log('Creating Razorpay order...');
        const razorpayResponse = await createRazorpayOrder({
          amount: order.totalAmount * 100
        }).unwrap();
        // console.log('Razorpay order created:', razorpayResponse);

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
          retry: false,
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
          modal: {
            ondismiss: function() {
              // Handle payment modal dismissal
              navigate('/user/checkout/payment/fail', { state: { orderId } });
            }
          },
          prefill: {
            name: order?.address?.name || "",
            contact: order?.address?.mobile || ""
          },
          theme: {
            color: "#3399cc"
          }
        };

        // console.log('Opening Razorpay with options:', options);
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error?.data?.message || 'Payment failed. Please try again.');
    }
  };

  if (isLoadingOrder) {
    return (
     <CustomSpinner/>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.primary} pt-[132px]`}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary Card */}
          <div className="lg:col-span-2">
            <Card className={currentTheme.secondary}>
              <CardBody className="p-6">
                <Typography variant="h5" className={`mb-6 ${currentTheme.text}`}>Order Summary</Typography>
                
                {/* Products List */}
                <List>
                  {order?.products.map((item) => (
                    <ListItem key={item.productId._id} className={`py-4 ${currentTheme.secondary} hover:${currentTheme.secondary}`}>
                      <ListItemPrefix>
                        <img 
                          src={item.productId.additionalImages[0].imageUrl} 
                          alt={item.productId.name}
                          className="h-16 w-16 object-cover rounded"
                        />
                      </ListItemPrefix>
                      <div className="flex flex-col flex-1 ml-4">
                        <Typography variant="h6" className={currentTheme.text}>{item.productId.name}</Typography>
                        <Typography className={`text-sm ${currentTheme.textGray}`}>
                          Quantity: {item.quantity} × ₹{item.priceAtPurchase}
                        </Typography>
                        <Typography className={`font-semibold mt-1 ${currentTheme.text}`}>
                          ₹{item.quantity * item.priceAtPurchase}
                        </Typography>
                      </div>
                    </ListItem>
                  ))}
                </List>

                {/* Price Breakdown */}
                <div className={`border-t mt-4 pt-4 space-y-2 ${currentTheme.border}`}>
                  <div className="flex justify-between">
                    <Typography className={currentTheme.text}>Subtotal:</Typography>
                    <Typography className={currentTheme.text}>₹{(order?.totalAmount - (order?.shippingAmount || 0))}</Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography className={currentTheme.text}>Shipping:</Typography>
                    <Typography className={currentTheme.text}>₹{order?.shippingAmount || 0}</Typography>
                  </div>
                  {/* <div className="flex justify-between">
                    <Typography className={currentTheme.text}>Shipping:</Typography>
                    <Typography className={currentTheme.text}>₹{order?.shippingAmount || 0}</Typography>
                  </div> */}
                  <div className={`flex justify-between font-bold pt-2 border-t ${currentTheme.border}`}>
                    <Typography className={currentTheme.text}>Total:</Typography>
                    <Typography className={currentTheme.text}>₹{(order?.totalAmount)}</Typography>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className={`mt-6 border-t pt-4 ${currentTheme.border}`}>
                  <Typography variant="h6" className={`mb-2 ${currentTheme.text}`}>Delivery Address</Typography>
                  <div className={`${currentTheme.secondary} p-4 rounded`}>
                  <Typography className={`mb-1 text-sm md:text-base ${currentTheme.text}`}>{order.address.fullName}</Typography>
                  <Typography className={`mb-1 text-sm md:text-base ${currentTheme.text}`}>{order.address.phone}</Typography>
                  <Typography className={`mb-1 text-sm md:text-base ${currentTheme.text}`}>{order.address.address}</Typography>
                  <Typography className={`mb-1 text-sm md:text-base ${currentTheme.text}`}>
                    {order.address.city}, {order.address.state} {order.address.pincode}
                  </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Payment Method Card */}
          <div className="lg:col-span-1">
            <Card className={currentTheme.secondary}>
              <CardBody className="p-6">
                <Typography variant="h5" className={`mb-6 ${currentTheme.text}`}>Select Payment Method</Typography>

                <div className="space-y-4 mb-6">
                  <div 
                    className={`flex items-center space-x-3 p-4 border rounded-lg 
                      ${order?.totalAmount >= 1000 ? 'cursor-pointer' : 'opacity-60'} 
                      ${selectedPaymentMethod === 'COD' 
                        ? `${currentTheme.secondary} border-2 border-yellow-200` 
                        : `${currentTheme.secondary} hover:shadow-md`}`}
                    onClick={() => order?.totalAmount >= 1000 && setSelectedPaymentMethod('COD')}
                  >
                    <Radio
                      name="payment"
                      color="yellow"
                      checked={selectedPaymentMethod === 'COD'}
                      onChange={() => {}}
                      disabled={order?.totalAmount < 1000}
                      className="pointer-events-none"
                    />
                    <div>
                      <Typography variant="h6" className={currentTheme.text}>Cash on Delivery</Typography>
                      <Typography variant="small" className={currentTheme.textGray}>Pay when you receive the tools</Typography>
                      {order?.totalAmount < 1000 && (
                        <Typography variant="small" className="text-red-500 mt-1">
                          COD available only on orders above ₹1,000
                        </Typography>
                      )}
                    </div>
                  </div>

                  <div 
                    className={`flex items-center space-x-3 p-4 border rounded-lg 
                      ${!insufficientWalletBalance ? 'cursor-pointer' : 'opacity-60'}
                      ${selectedPaymentMethod === 'WALLET' 
                        ? `${currentTheme.secondary} border-2 border-yellow-200` 
                        : `${currentTheme.secondary} hover:shadow-md`}`}
                    onClick={() => !insufficientWalletBalance && setSelectedPaymentMethod('WALLET')}
                  >
                    <Radio
                      name="payment"
                      color="yellow"
                      checked={selectedPaymentMethod === 'WALLET'}
                      onChange={() => {}}
                      disabled={insufficientWalletBalance}
                      className="pointer-events-none"
                    />
                    <div>
                      <Typography variant="h6" className={currentTheme.text}>Pay using Wallet</Typography>
                      <Typography variant="small" className={currentTheme.textGray}>
                        Available Balance: ₹{wallet?.balance || 0}
                      </Typography>
                      {insufficientWalletBalance && (
                        <Typography variant="small" className="text-red-500">
                          Insufficient balance
                        </Typography>
                      )}
                    </div>
                  </div>

                  <div 
                    className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer
                      ${selectedPaymentMethod === 'RAZORPAY' 
                        ? `${currentTheme.secondary} border-2 border-yellow-200` 
                        : `${currentTheme.secondary} hover:shadow-md`}`}
                    onClick={() => setSelectedPaymentMethod('RAZORPAY')}
                  >
                    <Radio
                      name="payment"
                      color="yellow"
                      checked={selectedPaymentMethod === 'RAZORPAY'}
                      onChange={() => {}}
                      className="pointer-events-none"
                    />
                    <div>
                      <Typography variant="h6" className={currentTheme.text}>Online Payment</Typography>
                      <Typography variant="small" className={currentTheme.textGray}>Pay securely with Razorpay</Typography>
                    </div>
                  </div>
                </div>

                <div className={`border-t pt-4 ${currentTheme.border}`}>
                  <div className="flex justify-between mb-4">
                    <Typography className={currentTheme.text}>Amount to Pay:</Typography>
                    <Typography variant="h6" className={currentTheme.text}>₹{order?.totalAmount || 0}</Typography>
                  </div>

                  <Button
                    className={`w-full ${currentTheme.button} ${currentTheme.buttonHover} text-black`}
                    size="lg"
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
    </div>
  );
};

export default PurchasePaymentPage;