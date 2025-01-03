import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const { data: cart, isLoading: cartLoading, error: cartError } = useGetCartQuery();
  const { data: addresses, isLoading: addressLoading } = useGetAddressesQuery();
  const { data: couponsData, isLoading: couponsLoading } = useGetAvailableCouponsQuery({
    page: 1,
    limit: 10
  });
  const availableCoupons = couponsData?.coupons || [];
  console.log('Coupons Data:', couponsData); // Debug log
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

    const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);
    if (!selectedAddress) {
      toast.error("Selected address not found");
      return;
    }

    try {
      const orderResponse = await createOrder({
        products: cart.items.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          priceAtPurchase: item.price
        })),
        address: selectedAddress,
        totalAmount: calculateFinalAmount(),
        shippingAmount: calculateShippingCost()
      }).unwrap();

      dispatch(setCheckoutData({
        orderId: orderResponse._id,
        amount: calculateFinalAmount()
      }));

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
      // First check if the coupon exists in available coupons
      const existingCoupon = availableCoupons.find(
        coupon => coupon.code === couponCode
      );

      if (existingCoupon) {
        if (cart?.totalAmount < existingCoupon.minimumPurchase) {
          toast.error(`Minimum purchase of ₹${existingCoupon.minimumPurchase} required to use this coupon`);
          setAppliedCoupon(null);
          return;
        }

        setAppliedCoupon(existingCoupon);
        toast.success("Coupon applied successfully!");
        return;
      }

      // If not found in available coupons, validate with API
      const result = await validateCoupon();
      const coupon = result.data?.coupon;
      
      if (!coupon) {
        toast.error("Invalid or expired coupon");
        setAppliedCoupon(null);
        return;
      }

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

  const calculateShippingCost = () => {
    return cart?.totalAmount >= 1000 ? 0 : 50;
  };

  const calculateFinalAmount = () => {
    const subtotal = cart?.totalAmount || 0;
    const shippingCost = calculateShippingCost();
    let finalAmount = subtotal + shippingCost;

    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        const discount = (subtotal * appliedCoupon.discountAmount) / 100;
        finalAmount = finalAmount - discount;
      } else {
        finalAmount = finalAmount - appliedCoupon.discountAmount;
      }
    }

    return Math.max(0, finalAmount);
  };

  if (cartLoading || addressLoading || couponsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (cartError) {
    return (
      <div className={`container mx-auto px-4 py-8 ${currentTheme.primary}`}>
        <Typography className={`text-center ${currentTheme.accent}`}>
          Error loading checkout. Please try again later.
        </Typography>
      </div>
    );
  }

  const cartItems = cart?.items || [];
  const totalAmount = cart?.totalAmount || 0;
  const userAddresses = addresses|| [];

  return (
    <div className={`min-h-screen ${currentTheme.primary} pt-[112px]`}>
      <div className="container mx-auto px-4 py-8">
        <Typography variant="h3" className={`mb-6 ${currentTheme.text}`}>Checkout</Typography>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex justify-between gap-2 items-center mb-4">
              <Typography variant="h5" className={currentTheme.text}>Select Delivery Address</Typography>
              {addresses.length < 5 &&  
                <Button
                  size="sm"
                  className={`flex items-center gap-2 ${currentTheme.button} ${currentTheme.buttonHover} text-black`}
                  onClick={handleAddNewAddress}
                >
                  <PlusIcon className="h-4 w-4" /> Add New Address
                </Button>
              }
            </div>

            <div className="overflow-y-auto pr-2 max-h-[60vh]">
              {userAddresses.length === 0 ? (
                <div className="text-center py-8">
                  <Typography className={currentTheme.textGray}>No addresses found. Please add a new address.</Typography>
                </div>
              ) : (
                <div className="space-y-4">
                  {userAddresses.map((address) => (
                    <div 
                      key={address._id} 
                      className={`
                        flex items-center gap-4 p-4 border rounded-lg cursor-pointer
                        ${selectedAddressId === address._id 
                          ? `${currentTheme.secondary} border-2 border-yellow-200` 
                          : `${currentTheme.secondary} hover:shadow-md`}
                      `}
                      onClick={() => setSelectedAddressId(address._id)}
                    >
                      <Radio
                        name="address"
                        color="yellow"
                        checked={selectedAddressId === address._id}
                        onChange={() => {}}
                        className="pointer-events-none"
                      />
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <Typography variant="h6" className={`mb-1 ${currentTheme.text}`}>
                              {address.fullName}
                              {address.isDefault && (
                                <span className="ml-2 text-xs text-green-500 bg-green-50 px-2 py-1 rounded">
                                  Default
                                </span>
                              )}
                            </Typography>
                            <Typography variant="small" className={`mb-1 ${currentTheme.textGray}`}>
                              {address.address}, {address.area}
                            </Typography>
                            <Typography variant="small" className={currentTheme.textGray}>
                              {address.city}, {address.state} - {address.pincode}
                            </Typography>
                            <Typography variant="small" className={currentTheme.textGray}>
                              Phone: {address.phone}
                            </Typography>
                          </div>
                          <Button 
                            size="sm" 
                            variant="text" 
                            className={currentTheme.text}
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
            <Card className={`sticky top-[112px] ${currentTheme.secondary}`}>
              <CardBody className="p-4">
                <Typography variant="h5" className={`mb-4 ${currentTheme.text}`}>Order Summary</Typography>
                
                {/* Coupon Section */}
                <div className="mb-4">
                  <div className="flex gap-2 mb-2">
                    <Input
                      type="text"
                      label="Enter Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      icon={<TagIcon className={`h-5 w-5 ${currentTheme.text}`} />}
                      className={`flex-1 ${currentTheme.input}`}
                      labelProps={{
                        className: currentTheme.textGray
                      }}
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={isValidating}
                      className={`flex items-center gap-2 ${currentTheme.button} ${currentTheme.buttonHover} text-black`}
                    >
                      {isValidating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black"></div>
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>

                  {/* Applied Coupon Display */}
                  {appliedCoupon && (
                    <div className={`mt-2 p-3 ${currentTheme.accent} bg-opacity-10 rounded-lg`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <Typography variant="h6" className={`text-sm ${currentTheme.accent}`}>
                            {appliedCoupon.code} Applied
                          </Typography>
                          <Typography variant="small" className={currentTheme.textGray}>
                            {appliedCoupon.discountType === 'percentage' 
                              ? `${appliedCoupon.discountAmount}% off`
                              : `₹${appliedCoupon.discountAmount} off`}
                          </Typography>
                        </div>
                        <Button
                          variant="text"
                          className="text-red-500 p-2"
                          onClick={handleRemoveCoupon}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Available Coupons Accordion */}
                  <Accordion
                    open={openAccordion === 1}
                    className={`mt-2 border rounded-lg ${currentTheme.secondary}`}
                  >
                    <AccordionHeader 
                      onClick={() => setOpenAccordion(openAccordion === 1 ? 0 : 1)}
                      className={`text-sm py-2 px-3 ${currentTheme.text}`}
                    >
                      Available Coupons
                    </AccordionHeader>
                    <AccordionBody className="px-3">
                      <div className="space-y-2">
                        {availableCoupons.map((coupon) => (
                          <div
                            key={coupon._id}
                            className={`p-3 rounded-lg cursor-pointer ${currentTheme.secondary} hover:shadow-md`}
                            onClick={() => handleCouponSelect(coupon)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <Typography variant="h6" className={`text-sm ${currentTheme.text}`}>
                                  {coupon.code}
                                </Typography>
                                <Typography variant="small" className={currentTheme.textGray}>
                                  {coupon.description}
                                </Typography>
                                <Typography variant="small" className={currentTheme.textGray}>
                                  Min. Purchase: ₹{coupon.minimumPurchase}
                                </Typography>
                              </div>
                              <Typography variant="h6" className={`text-sm ${currentTheme.accent}`}>
                                {coupon.discountType === 'percentage'
                                  ? `${coupon.discountAmount}% OFF`
                                  : `₹${coupon.discountAmount} OFF`}
                              </Typography>
                            </div>
                          </div>
                        ))}
                        {availableCoupons.length === 0 && (
                          <Typography className={`text-center text-sm ${currentTheme.textGray}`}>
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
                          <Typography variant="small" className={currentTheme.text}>
                            {item.product.name}
                          </Typography>
                          <Typography variant="small" className={currentTheme.textGray}>
                            Qty: {item.quantity}
                          </Typography>
                        </div>
                      </div>
                      <Typography className={currentTheme.text}>
                        ₹{item.price * item.quantity}
                      </Typography>
                    </div>
                  ))}

                  {/* Price Details */}
                  <hr className={`my-4 ${currentTheme.border}`} />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Typography className={currentTheme.textGray}>Subtotal</Typography>
                      <Typography className={currentTheme.text}>₹{totalAmount}</Typography>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-500">
                        <Typography>Coupon Discount</Typography>
                        <Typography>
                          - ₹{calculateFinalAmount() - totalAmount - calculateShippingCost()}
                        </Typography>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <Typography className={currentTheme.textGray}>Shipping</Typography>
                      <Typography className={currentTheme.text}>
                        {totalAmount >= 1000 ? 'Free' : '₹50'}
                      </Typography>
                    </div>
                    {totalAmount > 0 && totalAmount < 1000 && (
                      <Typography className={`text-sm text-center ${currentTheme.textGray}`}>
                        Add ₹{1000 - totalAmount} more for free shipping
                      </Typography>
                    )}
                    <hr className={`my-2 ${currentTheme.border}`} />
                    <div className="flex justify-between">
                      <Typography variant="h6" className={currentTheme.text}>Total</Typography>
                      <Typography variant="h6" className={currentTheme.text}>
                        ₹{calculateFinalAmount()}
                      </Typography>
                    </div>
                  </div>

                  <Button
                    className={`w-full ${currentTheme.button} ${currentTheme.buttonHover} text-black`}
                    size="lg"
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