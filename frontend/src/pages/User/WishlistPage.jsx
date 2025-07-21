import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AlertModal } from '../../components/AlertModal';
import { Toaster, toast } from 'sonner';
import { useSelector } from 'react-redux';
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
  useAddToCartMutation,
} from '../../../App/features/rtkApis/userApi';
import CustomSpinner from '../../components/utils/CustomSpinner';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const { data: wishlistData, isLoading, error } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart] = useAddToCartMutation();
  const wishlistItems = wishlistData?.wishlist?.products || [];
  
  const [openAlert, setOpenAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleOpenAlert = (productId) => {
    setItemToDelete(productId);
    setOpenAlert(true);
  };

  const handleRemoveItem = async () => {
    try {
      await removeFromWishlist(itemToDelete).unwrap();
      setOpenAlert(false);
      setItemToDelete(null);
      toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove item');
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart({ productId, quantity: 1 }).unwrap();
      toast.success('Product added to cart');
      await removeFromWishlist(productId).unwrap();
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error(error.data?.message || 'Failed to add to cart');
    }
  };

  if (isLoading) {
    return (
      <CustomSpinner/>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${currentTheme.primary}`}>
        <p className={currentTheme.accent}>Error loading wishlist. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-[112px] ${currentTheme.primary}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold ${currentTheme.text} mb-8`}>My Wishlist</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3 space-y-4">
            {wishlistItems.length === 0 ? (
              <div className={`${currentTheme.secondary} rounded-lg shadow-md p-8 text-center`}>
                <p className={`${currentTheme.text} text-xl mb-4`}>Your wishlist is empty</p>
                <Button
                  onClick={() => navigate('/user/all-products')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              wishlistItems.map((item) => (
                <Card key={item.productId._id} className={`${currentTheme.secondary} shadow-md hover:shadow-xl transition-shadow duration-300`}>
                  <CardBody className="flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src={item.productId.mainImage.imageUrl}
                      alt={item.productId.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <Typography variant="h5" className={currentTheme.text}>
                        {item.productId.name}
                      </Typography>
                      <Typography className={`${currentTheme.text} text-sm`}>
                        Price: ₹{item.productId.price}
                      </Typography>
                      <Typography className={`text-sm ${currentTheme.textGray}`}>
                        Added on {new Date(item.addedAt).toLocaleDateString()}
                      </Typography>
                      {item.productId.stock === 0 && (
                        <Typography className="text-red-500">
                          Out of Stock
                        </Typography>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <Button
                        className="bg-yellow-500 hover:bg-yellow-600 text-black flex items-center gap-2"
                        onClick={() => handleAddToCart(item.productId._id)}
                        disabled={item.productId.stock === 0}
                      >
                        <ShoppingCartIcon className="h-4 w-4" />
                        Add to Cart
                      </Button>
                      <IconButton
                        variant="text"
                        color="red"
                        onClick={() => handleOpenAlert(item.productId._id)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </IconButton>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      <AlertModal
        open={openAlert}
        handleOpen={() => setOpenAlert(false)}
        heading="Remove Item"
        message="Are you sure you want to remove this item from your wishlist?"
        confirmText="Remove"
        cancelText="Cancel"
        confirmColor="red"
        onConfirm={handleRemoveItem}
      />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default WishlistPage;