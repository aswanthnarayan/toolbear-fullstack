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
import { useSelector } from 'react-redux';
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
  
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  
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
      <div className={`min-h-screen flex items-center justify-center ${currentTheme.primary}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${currentTheme.primary}`}>
        <p className={currentTheme.accent}>Error loading cart. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-[112px] ${currentTheme.primary}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold ${currentTheme.text} mb-8`}>Your Cart</h1>
        
        {(hasUnlistedItems || hasOutOfStockItems || hasInsufficientStock) && (
          <div className={`mb-4 p-4 ${currentTheme.warning} rounded-lg`}>
            <Typography className="font-medium text-yellow-800">
              Some items in your cart are currently unavailable
            </Typography>
            <Typography className="text-sm text-yellow-700">
              Please remove these items before proceeding to checkout
            </Typography>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length === 0 ? (
              <div className={`${currentTheme.secondary} rounded-lg shadow-md p-8 text-center`}>
                <p className={`${currentTheme.text} text-xl mb-4`}>Your cart is empty</p>
                <Button
                  onClick={() => navigate('/user/all-products')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              cartItems.map((item) => (
                <Card key={item.product._id} className={`${currentTheme.secondary} shadow-md hover:shadow-xl transition-shadow duration-300`}>
                  <CardBody className="flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src={item.product.mainImage.imageUrl}
                      alt={item.product.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <Typography variant="h5" className={currentTheme.text}>
                        {item.product.name}
                      </Typography>
                      <Typography className={`${currentTheme.text} text-sm`}>
                        Price: ₹{item.price}
                      </Typography>
                      {!item.product.isListed && (
                        <Typography className="text-red-500">
                          This product is no longer available
                        </Typography>
                      )}
                      {item.product.stock === 0 && (
                        <Typography className="text-red-500">
                          Out of stock
                        </Typography>
                      )}
                      {item.quantity > item.product.stock && (
                        <Typography className="text-red-500">
                          Only {item.product.stock} units available
                        </Typography>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <IconButton
                          variant="text"
                          className={currentTheme.text}
                          onClick={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                          disabled={!item.product.isListed}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </IconButton>
                        <Typography className={currentTheme.text}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          variant="text"
                          className={currentTheme.text}
                          onClick={() => handleQuantityChange(item.product._id, item.quantity, 1)}
                          disabled={!item.product.isListed}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </IconButton>
                      </div>
                      <IconButton
                        variant="text"
                        color="red"
                        onClick={() => handleOpenAlert(item.product._id)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </IconButton>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className={`${currentTheme.secondary} shadow-md sticky top-24`}>
              <CardBody>
                <Typography variant="h5" className={`${currentTheme.text} mb-4`}>
                  Order Summary
                </Typography>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Typography className={currentTheme.textGray}>Subtotal:</Typography>
                    <Typography className={currentTheme.text}>₹{totalAmount}</Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography className={currentTheme.textGray}>Shipping:</Typography>
                    <Typography className={currentTheme.text}>{totalAmount >= 1000 ? 'Free' : '₹50'}</Typography>
                  </div>
                  <div className="border-t border-gray-200 my-4"></div>
                  <div className="flex justify-between">
                    <Typography className={`${currentTheme.text} font-bold`}>Total:</Typography>
                    <Typography className={`${currentTheme.text} font-bold`}>₹{totalAmount >= 1000 ? totalAmount : totalAmount + 50}</Typography>
                  </div>
                  {totalAmount > 0 && totalAmount < 1000 && (
                    <Typography className={`text-sm text-center mt-2 ${currentTheme.textGray}`}>
                      Add ₹{1000 - totalAmount} more for free shipping
                    </Typography>
                  )}
                </div>
                <Button
                  fullWidth
                  className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black"
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0 || hasUnlistedItems || hasOutOfStockItems || hasInsufficientStock}
                >
                  {(hasUnlistedItems || hasOutOfStockItems || hasInsufficientStock) 
                    ? 'Remove Unavailable Items' 
                    : 'Proceed to Checkout'
                  }
                </Button>
              </CardBody>
            </Card>
          </div>
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
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default CartPage;