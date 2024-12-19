import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCheckoutData } from '../../../App/features/slices/checkoutSlice';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Radio,
  Spinner,
  Input,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { PlusIcon, TagIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { 
  useGetCartQuery, 
  useGetAddressesQuery,
  useGetAvailableCouponsQuery,
  useValidateCouponQuery,
  useCreateOrderMutation
} from '../../../App/features/rtkApis/userApi';
import { Toaster, toast } from 'sonner';
import AddAddressModal from '../../components/Users/profile/shared/AddAddressModal';
import AddressCard from '../../components/Users/profile/shared/AddressCard';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(0);

  const { data: cart, isLoading: cartLoading, error: cartError } = useGetCartQuery();
  const { data: addresses, isLoading: addressLoading } = useGetAddressesQuery();
  const { data: availableCoupons = [] } = useGetAvailableCouponsQuery();
  const { data: validatedCoupon, isLoading: isValidating, refetch: validateCoupon } = useValidateCouponQuery(couponCode, {
    skip: !couponCode // Skip the query if no coupon code
  });
  const [createOrder] = useCreateOrderMutation();

  const handleAddNewAddress = () => {
    setEditAddress(null);
    setIsAddressModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setEditAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddressModalOpen(false);
    setEditAddress(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    // Find the selected address from addresses
    const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);
    if (!selectedAddress) {
      toast.error("Selected address not found");
      return;
    }

    try {
      // Create order with pending payment status
      const orderResponse = await createOrder({
        products: cart.items.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          priceAtPurchase: item.price
        })),
        address: selectedAddress,
        totalAmount: calculateFinalAmount(),
        shippingAmount: 0 // Free shipping
      }).unwrap();

      // Store order ID and amount in Redux for payment page
      dispatch(setCheckoutData({
        orderId: orderResponse._id,
        amount: calculateFinalAmount()
      }));

      // Navigate to payment page with orderId in state
      navigate('/user/checkout/payments', {
        state: { orderId: orderResponse._id }
      });
    } catch (error) {
      toast.error(error.data?.error || "Failed to create order");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      // Check if the coupon exists in available coupons
      const existingCoupon = availableCoupons.find(
        coupon => coupon.code === couponCode
      );

      if (existingCoupon) {
        // Check minimum purchase requirement
        if (cart?.totalAmount < existingCoupon.minimumPurchase) {
          toast.error(`Minimum purchase of ₹${existingCoupon.minimumPurchase} required to use this coupon`);
          setAppliedCoupon(null);
          return;
        }

        setAppliedCoupon(existingCoupon);
        toast.success("Coupon applied successfully!");
        return;
      }

      // If not found in available coupons, validate through API
      const result = await validateCoupon();
      const coupon = result.data?.coupon;
      
      if (!coupon) {
        toast.error("Invalid or expired coupon");
        setAppliedCoupon(null);
        return;
      }

      // Check minimum purchase requirement
      if (cart?.totalAmount < coupon.minimumPurchase) {
        toast.error(`Minimum purchase of ₹${coupon.minimumPurchase} required to use this coupon`);
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon(coupon);
      toast.success("Coupon applied successfully!");
    } catch (error) {
      toast.error(error.data?.error || "Failed to apply coupon");
      setAppliedCoupon(null);
    }
  };

  const handleCouponSelect = (coupon) => {
    // Check minimum purchase requirement before setting coupon
    if (cart?.totalAmount < coupon.minimumPurchase) {
      toast.error(`Minimum purchase of ₹${coupon.minimumPurchase} required to use this coupon`);
      return;
    }
    
    setCouponCode(coupon.code);
    setAppliedCoupon(coupon);
    toast.success("Coupon applied successfully!");
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  const calculateFinalAmount = () => {
    if (!appliedCoupon || !cart?.totalAmount) return cart?.totalAmount || 0;

    const { discountType, discountAmount, maxDiscount } = appliedCoupon;
    let discount = 0;

    if (discountType === 'percentage') {
      // Calculate percentage discount and cap it at maxDiscount
      discount = Math.min((cart.totalAmount * discountAmount) / 100, maxDiscount);
    } else {
      // For fixed discount, use the discountAmount directly
      discount = discountAmount;
    }

    return Math.max(cart.totalAmount - discount, 0); // Ensure total doesn't go below 0
  };

  if (cartLoading || addressLoading) {
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
  const userAddresses = addresses|| [];

  return (
    <div className="container mx-auto px-4 py-8 pt-[112px]">
      <Typography variant="h3" className="mb-6">Checkout</Typography>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex justify-between gap-2 items-center mb-4">
            <Typography variant="h5">Select Delivery Address</Typography>
            {addresses.length < 5 &&  
              <Button
              size="sm"
              className="flex items-center gap-2"
              onClick={handleAddNewAddress}
            >
              <PlusIcon className="h-4 w-4" /> Add New Address
            </Button>
            }
          </div>

          <div className="overflow-y-auto pr-2 max-h-[60vh]">
            {userAddresses.length === 0 ? (
              <div className="text-center py-8">
                <Typography color="gray">No addresses found. Please add a new address.</Typography>
              </div>
            ) : (
              <div className="space-y-4">
                {userAddresses.map((address) => (
                  <div 
                    key={address._id} 
                    className={`
                      flex items-center gap-4 p-4 border rounded-lg
                      ${selectedAddressId === address._id ? 'bg-blue-50 border-blue-200' : 'bg-white'}
                    `}
                  >
                    <Radio
                      name="address"
                      color="blue"
                      checked={selectedAddressId === address._id}
                      onChange={() => setSelectedAddressId(address._id)}
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <Typography variant="h6" className="mb-1">
                            {address.fullName}
                            {address.isDefault && (
                              <span className="ml-2 text-xs text-green-500 bg-green-50 px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                          </Typography>
                          <Typography variant="small" color="gray" className="mb-1">
                            {address.address}, {address.area}
                          </Typography>
                          <Typography variant="small" color="gray">
                            {address.city}, {address.state} - {address.pincode}
                          </Typography>
                          <Typography variant="small" color="gray">
                            Phone: {address.phone}
                          </Typography>
                        </div>
                        <Button 
                          size="sm" 
                          variant="text" 
                          color="blue-gray"
                          onClick={() => handleEditAddress(address)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-[112px]">
            <CardBody className="p-4">
              <Typography variant="h5" className="mb-4">Order Summary</Typography>
              
              {/* Coupon Section */}
              <div className="mb-4">
                <div className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    label="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    icon={<TagIcon className="h-5 w-5" />}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={isValidating}
                    className="flex items-center gap-2"
                  >
                    {isValidating ? (
                      <Spinner className="h-4 w-4" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>

                {/* Applied Coupon Display */}
                {appliedCoupon && (
                  <div className="mt-2 p-3 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <Typography variant="h6" color="green" className="text-sm">
                          {appliedCoupon.code} Applied
                        </Typography>
                        <Typography variant="small" color="gray">
                          {appliedCoupon.discountType === 'percentage' 
                            ? `${appliedCoupon.discountAmount}% off`
                            : `₹${appliedCoupon.discountAmount} off`}
                        </Typography>
                      </div>
                      <Button
                        variant="text"
                        color="red"
                        onClick={handleRemoveCoupon}
                        className="p-2"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}

                {/* Available Coupons Accordion */}
                <Accordion
                  open={openAccordion === 1}
                  className="mt-2 border rounded-lg"
                >
                  <AccordionHeader 
                    onClick={() => setOpenAccordion(openAccordion === 1 ? 0 : 1)}
                    className="text-sm py-2 px-3"
                  >
                    Available Coupons
                  </AccordionHeader>
                  <AccordionBody className="px-3">
                    <div className="space-y-2">
                      {availableCoupons.map((coupon) => (
                        <div
                          key={coupon._id}
                          className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                          onClick={() => handleCouponSelect(coupon)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <Typography variant="h6" className="text-sm">
                                {coupon.code}
                              </Typography>
                              <Typography variant="small" color="gray">
                                {coupon.description}
                              </Typography>
                              <Typography variant="small" color="blue-gray">
                                Min. Purchase: ₹{coupon.minimumPurchase}
                              </Typography>
                            </div>
                            <Typography variant="h6" color="blue" className="text-sm">
                              {coupon.discountType === 'percentage'
                                ? `${coupon.discountAmount}% OFF`
                                : `₹${coupon.discountAmount} OFF`}
                            </Typography>
                          </div>
                        </div>
                      ))}
                      {availableCoupons.length === 0 && (
                        <Typography className="text-center text-sm" color="gray">
                          No coupons available
                        </Typography>
                      )}
                    </div>
                  </AccordionBody>
                </Accordion>
              </div>

              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product._id} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.product.mainImage.imageUrl}
                        alt={item.product.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                      <div>
                        <Typography variant="small">{item.product.name}</Typography>
                        <Typography variant="small" color="gray">Qty: {item.quantity}</Typography>
                      </div>
                    </div>
                    <Typography>₹{item.price * item.quantity}</Typography>
                  </div>
                ))}

                {/* Price Details */}
                <hr className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Typography color="gray">Subtotal</Typography>
                    <Typography>₹{totalAmount}</Typography>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <Typography>Coupon Discount</Typography>
                      <Typography>
                        - ₹{calculateFinalAmount() - totalAmount}
                      </Typography>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <Typography color="gray">Shipping</Typography>
                    <Typography>Free</Typography>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between">
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">
                      ₹{calculateFinalAmount()}
                    </Typography>
                  </div>
                </div>

                <Button
                  color="blue"
                  size="lg"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={cartItems.length === 0 || !selectedAddressId}
                >
                  Make Payment
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <AddAddressModal
        isOpen={isAddressModalOpen}
        onClose={handleCloseModal}
        editAddress={editAddress}
      />
      
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default CheckoutPage;