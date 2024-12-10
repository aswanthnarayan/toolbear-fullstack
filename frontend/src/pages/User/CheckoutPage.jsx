import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCheckoutData } from '../../../App/features/slices/checkoutSlice';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Radio,
  Spinner
} from "@material-tailwind/react";
import { PlusIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useGetCartQuery, useGetAddressesQuery } from '../../../App/features/rtkApis/userApi';
import { Toaster, toast } from 'sonner';
import AddAddressModal from '../../components/Users/profile/shared/AddAddressModal';
import AddressCard from '../../components/Users/profile/shared/AddressCard';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: cart, isLoading: cartLoading, error: cartError } = useGetCartQuery();
  const { data: addresses, isLoading: addressLoading } = useGetAddressesQuery();
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);

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

    // Store in Redux 
    dispatch(setCheckoutData({
      selectedAddress,
      checkoutAmount: cart.totalAmount
    }));

    // Navigate to payment page
    navigate('/user/checkout/payments');
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
          {/* <div className='p-3 md:p-6 max-h-[70vh]'> */}
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
          {/* </div> */}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-[112px]">
            <CardBody className="p-4">
              <Typography variant="h5" className="mb-4">Order Summary</Typography>
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
                <hr className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Typography color="gray">Subtotal</Typography>
                    <Typography>₹{totalAmount}</Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography color="gray">Shipping</Typography>
                    <Typography>Free</Typography>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between">
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">₹{totalAmount}</Typography>
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