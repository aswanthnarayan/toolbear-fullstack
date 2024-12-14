import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Radio,
  Button,
  Spinner,
} from "@material-tailwind/react";
import { FaCreditCard, FaWallet } from "react-icons/fa";
import { RiSecurePaymentFill } from "react-icons/ri";
import { BsCashStack } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useGetCartQuery, useCreateOrderMutation, useCreateRazorpayOrderMutation } from '../../../App/features/rtkApis/userApi';
import { useSelector } from "react-redux";

const PurchasePaymentPage = () => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("");
  const [openAccordion, setOpenAccordion] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: cart, isLoading: cartLoading, error: cartError } = useGetCartQuery();
  const selectedAddress = useSelector((state) => state.checkout.selectedAddress);
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();

  console.log(cart);
  

  const savedCards = [
    { id: 1, number: "**** **** **** 1234", type: "VISA" },
    { id: 2, number: "**** **** **** 5678", type: "Mastercard" },
  ];

  const savedUPI = [
  ];

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleRazorpayPayment = async (orderData) => {
    try {
      const result = await createRazorpayOrder({ amount: cart?.totalAmount }).unwrap();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create Razorpay order');
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.order.amount,
        currency: "INR",
        name: "ToolBear",
        description: "Tool Purchase",
        order_id: result.order.id,
        handler: async function (response) {
          try {
            orderData.paymentMethod = "RAZORPAY";
            orderData.paymentDetails = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            };

            const orderResult = await createOrder(orderData).unwrap();
            if (orderResult) {
              toast.success("Payment successful!");
              navigate('/user/checkout/success');
            }
          } catch (error) {
            toast.error("Payment verification failed. Please contact support.");
            console.error('Order creation error:', error);
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        toast.error("Payment failed. Please try again.");
        setIsProcessing(false);
      });
      paymentObject.open();
    } catch (error) {
      setIsProcessing(false);
      toast.error(error.message || "Payment initialization failed");
      console.error('Razorpay error:', error);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    try {
      setIsProcessing(true);
      const orderData = {
        address: selectedAddress,
        products: cart?.items.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          priceAtPurchase: item.price
        })),
        totalAmount: cart?.totalAmount,
        shippingAmount: 0
      };

      if (selectedPayment === "cod") {
        orderData.paymentMethod = "COD";
        await createOrder(orderData).unwrap();
        toast.success("Order placed successfully!");
        navigate('/user/checkout/success');
      } else if (selectedPayment === "razorpay") {
        await handleRazorpayPayment(orderData);
      }
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error(error?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Typography variant="h5" color="red" className="text-center">
          Error loading checkout. Please try again later.
        </Typography>
      </div>
    );
  }

  const cartItems = cart?.items || [];
  const totalAmount = cart?.totalAmount || 0;

  const renderOrderSummary = () => (
    <div className="lg:col-span-1">
      <Card>
        <CardBody>
          <Typography variant="h5" className="mb-4">Order Summary</Typography>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Typography>Items Total:</Typography>
              <Typography>₹{totalAmount}</Typography>
            </div>
            <div className="flex justify-between">
              <Typography>Shipping:</Typography>
              <Typography>₹0</Typography>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <Typography>Total:</Typography>
                <Typography>₹{totalAmount}</Typography>
              </div>
            </div>
          </div>
          
          <Button
            size="lg"
            color="blue"
            className="w-full mt-4"
            onClick={handlePlaceOrder}
            disabled={isCreatingOrder || isProcessing}
          >
            {(isCreatingOrder || isProcessing) ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner size="sm" />
                <span>Processing...</span>
              </div>
            ) : (
              "Place Order"
            )}
          </Button>
        </CardBody>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 pt-[112px]">
      <div className="container mx-auto px-4">
        <Typography variant="h4" className="mb-6">
          Select Payment Method
        </Typography>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardBody className="flex flex-col gap-4">
                {/* Razorpay Option */}
                <div 
                  className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer ${
                    selectedPayment === "razorpay" ? "bg-blue-50 border-blue-200" : "bg-white"
                  }`}
                  onClick={() => setSelectedPayment("razorpay")}
                >
                  <Radio
                    name="payment"
                    color="blue"
                    checked={selectedPayment === "razorpay"}
                    onChange={() => setSelectedPayment("razorpay")}
                  />
                  <div className="flex items-center gap-3">
                    <RiSecurePaymentFill className="text-2xl text-blue-500" />
                    <div>
                      <Typography variant="h6">Razorpay</Typography>
                      <Typography variant="small" color="gray">
                        Pay securely with Razorpay
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* Cards Section */}
                <div 
                  className={`border rounded-lg overflow-hidden bg-white`}
                >
                  <div 
                    className="flex items-center gap-4 p-4 cursor-pointer"
                    onClick={() => setOpenAccordion(openAccordion === 'cards' ? null : 'cards')}
                  >
                    <div className="flex items-center gap-3 flex-grow">
                      <FaCreditCard className="text-2xl text-blue-500" />
                      <Typography variant="h6">Saved Cards</Typography>
                    </div>
                  </div>
                  
                  {openAccordion === 'cards' && (
                    <div className="px-4 pb-4">
                      <div className="space-y-3 pl-10">
                        {savedCards.map((card) => (
                          <div 
                            key={card.id} 
                            className={`flex items-center gap-4 p-3 border rounded ${
                              selectedPayment === `card-${card.id}` ? "bg-blue-50 border-blue-200" : "bg-white"
                            }`}
                            onClick={() => setSelectedPayment(`card-${card.id}`)}
                          >
                            <Radio
                              name="payment"
                              color="blue"
                              checked={selectedPayment === `card-${card.id}`}
                              onChange={() => setSelectedPayment(`card-${card.id}`)}
                            />
                            <Typography>{card.number} - {card.type}</Typography>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* UPI Section */}
                <div 
                  className={`border rounded-lg overflow-hidden bg-white`}
                >
                  <div 
                    className="flex items-center gap-4 p-4 cursor-pointer"
                    onClick={() => setOpenAccordion(openAccordion === 'upi' ? null : 'upi')}
                  >
                    <div className="flex items-center gap-3 flex-grow">
                      <FaWallet className="text-2xl text-blue-500" />
                      <Typography variant="h6">Saved UPI</Typography>
                    </div>
                  </div>
                  
                  {openAccordion === 'upi' && (
                    <div className="px-4 pb-4">
                      <div className="space-y-3 pl-10">
                        {savedUPI.map((upi) => (
                          <div 
                            key={upi.id} 
                            className={`flex items-center gap-4 p-3 border rounded ${
                              selectedPayment === `upi-${upi.id}` ? "bg-blue-50 border-blue-200" : "bg-white"
                            }`}
                            onClick={() => setSelectedPayment(`upi-${upi.id}`)}
                          >
                            <Radio
                              name="payment"
                              color="blue"
                              checked={selectedPayment === `upi-${upi.id}`}
                              onChange={() => setSelectedPayment(`upi-${upi.id}`)}
                            />
                            <Typography>{upi.id}</Typography>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* COD Option */}
                <div 
                  className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer ${
                    selectedPayment === "cod" ? "bg-blue-50 border-blue-200" : "bg-white"
                  }`}
                  onClick={() => setSelectedPayment("cod")}
                >
                  <Radio
                    name="payment"
                    color="blue"
                    checked={selectedPayment === "cod"}
                    onChange={() => setSelectedPayment("cod")}
                  />
                  <div className="flex items-center gap-3">
                    <BsCashStack className="text-2xl text-blue-500" />
                    <div>
                      <Typography variant="h6">Cash on Delivery</Typography>
                      <Typography variant="small" color="gray">
                        Pay when you receive
                      </Typography>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {renderOrderSummary()}
        </div>
      </div>
    </div>
  );
};

export default PurchasePaymentPage;