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
import { ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AlertModal } from '../../components/AlertModal';
import { Toaster, toast } from 'sonner';
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
  useAddToCartMutation,
} from '../../../App/features/rtkApis/userApi';

const WishlistPage = () => {
  const navigate = useNavigate();
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
      // Optionally remove from wishlist after adding to cart
      await removeFromWishlist(productId).unwrap();
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error(error.data?.message || 'Failed to add to cart');
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
          Error loading wishlist. Please try again later.
        </Typography>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-[112px]">
      <Typography variant="h3" className="mb-6">My Wishlist</Typography>
      
      <div className="grid grid-cols-1 gap-6">
        {wishlistItems.length === 0 ? (
          <Card>
            <CardBody className="flex flex-col items-center justify-center py-8">
              <Typography variant="h5" className="mb-2">Your wishlist is empty</Typography>
              <Typography color="gray" className="mb-4">Add items to your wishlist while shopping!</Typography>
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
            {wishlistItems.map((item) => (
              <Card key={item.productId._id} className="overflow-hidden">
                <CardBody className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.productId.mainImage.imageUrl}
                      alt={item.productId.name}
                      className="h-24 w-24 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <Typography variant="h6">{item.productId.name}</Typography>
                      <Typography color="gray" className="mb-2">₹{item.productId.price}</Typography>
                      <Typography color="gray" className="text-sm mb-2">
                        Added on {new Date(item.addedAt).toLocaleDateString()}
                      </Typography>
                      {item.productId.stock === 0 && (
                        <Typography color="red" className="text-sm">
                          Out of Stock
                        </Typography>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        color="blue"
                        variant="outlined"
                        className="flex items-center gap-2"
                        onClick={() => handleAddToCart(item.productId._id)}
                        disabled={item.productId.stock === 0}
                      >
                        <ShoppingCartIcon className="h-4 w-4" />
                        Add to Cart
                      </Button>
                      <IconButton
                        color="red"
                        variant="text"
                        onClick={() => handleOpenAlert(item.productId._id)}
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
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default WishlistPage;