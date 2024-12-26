import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
  IconButton,
  Spinner,
} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AlertModal } from '../../components/AlertModal';
import { Toaster, toast } from 'sonner';
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartQuantityMutation,
} from '../../../App/features/rtkApis/userApi';

const CartPage = () => {
  const navigate = useNavigate();
  const { data: cart, isLoading, error, refetch } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateQuantity] = useUpdateCartQuantityMutation();
  const cartItems = cart?.items || [];  
  const totalAmount = cart?.totalAmount || 0;
  
  const [openAlert, setOpenAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Check for unlisted products and stock issues
  const unlistedItems = cartItems.filter(item => !item.product.isListed);
  const outOfStockItems = cartItems.filter(item => item.product.stock === 0);
  const insufficientStockItems = cartItems.filter(item => item.quantity > item.product.stock);
  
  const hasUnlistedItems = unlistedItems.length > 0;
  const hasOutOfStockItems = outOfStockItems.length > 0;
  const hasInsufficientStock = insufficientStockItems.length > 0;

  const handleCheckout = async () => {
    try {
      // Refetch cart to get latest product status
      const latestCart = await refetch();
      
      if (!latestCart.data) {
        toast.error('Unable to fetch latest cart data');
        return;
      }
      
      // Check latest cart data
      const unlistedItems = latestCart.data.items.filter(item => !item.product.isListed);
      const outOfStockItems = latestCart.data.items.filter(item => item.product.stock === 0);
      const insufficientStockItems = latestCart.data.items.filter(item => item.quantity > item.product.stock);

      if (unlistedItems.length > 0) {
        toast.error(`Please remove unavailable items: ${unlistedItems.map(item => item.product.name).join(', ')}`);
        return;
      }
      
      if (outOfStockItems.length > 0) {
        toast.error(`Please remove out of stock items: ${outOfStockItems.map(item => item.product.name).join(', ')}`);
        return;
      }
      
      if (insufficientStockItems.length > 0) {
        insufficientStockItems.forEach(item => {
          toast.error(`${item.product.name} has only ${item.product.stock} units available`);
        });
        return;
      }

      // All checks passed, proceed to checkout
      navigate('/user/checkout');
    } catch (error) {
      console.error('Checkout validation failed:', error);
      toast.error('Unable to proceed with checkout. Please try again.');
    }
  };

  const handleOpenAlert = (productId) => {
    console.log('Opening alert for product:', productId);
    setItemToDelete(productId);
    setOpenAlert(true);
  };

  const handleQuantityChange = async (productId, currentQuantity, change) => {
    const newQuantity = Math.max(1, Math.min(3, currentQuantity + change));
    
    const cartItem = cartItems.find(item => item.product._id === productId);
    
    
    if (currentQuantity === 3 && change > 0) {
      toast.error("Maximum quantity limit is 3 items");
      return false;
    }
    
    if (cartItem && newQuantity > cartItem.product.stock) {
      toast.error(`Stock limit exceeded. Available stock: ${cartItem.product.stock}`);
      return false;
    }

    try {
      await updateQuantity({ productId, quantity: newQuantity }).unwrap();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveItem = async () => {
    try {
      await removeFromCart(itemToDelete).unwrap();
      setOpenAlert(false);
      setItemToDelete(null);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove item');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Typography variant="h5" color="red" className="text-center">
          Error loading cart. Please try again later.
        </Typography>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-[112px]">
      <Typography variant="h3" className="mb-6">Shopping Cart</Typography>
      
      {(hasUnlistedItems || hasOutOfStockItems || hasInsufficientStock) && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Typography color="amber" className="font-medium">
            Some items in your cart are currently unavailable
          </Typography>
          <Typography color="gray" className="text-sm">
            Please remove these items before proceeding to checkout
          </Typography>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {cartItems.length === 0 ? (
            <Card>
              <CardBody className="flex flex-col items-center justify-center py-8">
                <Typography variant="h5" className="mb-2">Your cart is empty</Typography>
                <Typography color="gray" className="mb-4">Add some items to your cart to get started!</Typography>
                <Button 
                  color="blue"
                  onClick={() => navigate('/user/all-products')}
                >
                  Continue Shopping
                </Button>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card 
                  key={item.product._id} 
                  className={`overflow-hidden ${!item.product.isListed ? 'opacity-75' : ''}`}
                >
                  <CardBody className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.mainImage.imageUrl}
                        alt={item.product.name}
                        className="h-24 w-24 object-cover rounded-lg"
                      />
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <Typography variant="h6">{item.product.name}</Typography>
                          {!item.product.isListed && (
                            <span className="px-2 py-1 text-xs bg-red-50 text-red-500 rounded">
                              Unavailable
                            </span>
                          )}
                        </div>
                        <Typography color="gray" className="mb-2">₹{item.price}</Typography>
                        <div className="flex items-center gap-2">
                          <IconButton
                            size="sm"
                            variant="outlined"
                            onClick={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                            disabled={!item.product.isListed}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </IconButton>
                          <Typography className="w-12 text-center">{item.quantity}</Typography>
                          <IconButton
                            size="sm"
                            variant="outlined"
                            onClick={() => handleQuantityChange(item.product._id, item.quantity, 1)}
                            disabled={!item.product.isListed}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Typography variant="h6">₹{item.price * item.quantity}</Typography>
                        <IconButton
                          color="red"
                          variant="text"
                          onClick={() => handleOpenAlert(item.product._id)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </IconButton>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardBody className="p-4">
              <Typography variant="h5" className="mb-4">Order Summary</Typography>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Typography color="gray">Subtotal</Typography>
                  <Typography>₹{totalAmount}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography color="gray">Shipping</Typography>
                  <Typography>{totalAmount >= 1000 ? 'Free' : '₹50'}</Typography>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between">
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">₹{totalAmount >= 1000 ? totalAmount : totalAmount + 50}</Typography>
                </div>
                {totalAmount > 0 && totalAmount < 1000 && (
                  <Typography color="gray" className="text-sm text-center mt-2">
                    Add ₹{1000 - totalAmount} more for free shipping
                  </Typography>
                )}
              </div>
              <Button
                color="blue"
                size="lg"
                fullWidth
                className="mt-4"
                disabled={cartItems.length === 0 || hasUnlistedItems || hasOutOfStockItems || hasInsufficientStock}
                onClick={handleCheckout}
              >
                {(hasUnlistedItems || hasOutOfStockItems || hasInsufficientStock) ? 'Remove Unavailable Items to Checkout' : 'Proceed to Checkout'}
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      <AlertModal
        open={openAlert}
        handleOpen={() => setOpenAlert(false)}
        heading="Remove Item"
        message="Are you sure you want to remove this item from your cart?"
        confirmText="Remove"
        cancelText="Cancel"
        confirmColor="red"
        onConfirm={handleRemoveItem}
      />
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default CartPage;