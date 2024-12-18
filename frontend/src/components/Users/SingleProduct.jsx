import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Typography, Button } from "@material-tailwind/react";
import {
  ShoppingCartIcon,
  HeartIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import Magnifier from "react-magnifier";
import { 
  useAddToCartMutation,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetWishlistQuery
} from "../../../App/features/rtkApis/userApi";
import { useNavigate } from "react-router-dom";

const SingleProduct = ({ product, toastMsg,isInWishlist }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [isInCart, setIsInCart] = useState(false);
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  

  const handleAddToCart = async () => {
    try {
      await addToCart({ productId: product._id, quantity: 1 }).unwrap();
      setIsInCart(true);
      toastMsg("Product added to cart", "success");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toastMsg(error.data.message, "error");
    }
  };

  const handleGoToCart = (e) => {
    e.preventDefault(); // Prevent navigation from Link
    navigate("/user/cart");
  };

  const handleWishlist = async () => {
    try {
      if (isInWishlist) {
        await removeFromWishlist(product._id).unwrap();
        toastMsg("Removed from wishlist", "success");
      } else {
        await addToWishlist({ productId: product._id }).unwrap();
        toastMsg("Added to wishlist", "success");
      }
    } catch (error) {
      toastMsg(error.data?.message || "Failed to update wishlist", "error");
    }
  };

  const renderRating = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <span key={index}>
              {starValue <= rating ? (
                <StarIconSolid className="h-5 w-5 text-yellow-500" />
              ) : starValue - 0.5 <= rating ? (
                <StarIconSolid className="h-5 w-5 text-yellow-500/50" />
              ) : (
                <StarIconSolid className="h-5 w-5 text-yellow-500/30" />
              )}
            </span>
          );
        })}
      </div>
    );
  };

  // Get all product images
  const productImages = [];

  // Add main image
  if (product.mainImage) {
    productImages.push(product.mainImage?.imageUrl || product.mainImage);
  }

  // Add sub images
  if (product.subImages && Array.isArray(product.subImages)) {
    product.subImages.forEach((img) => {
      const imageUrl = img?.imageUrl || img;
      if (imageUrl) productImages.push(imageUrl);
    });
  }

  // Add additional images
  if (product.additionalImages && Array.isArray(product.additionalImages)) {
    product.additionalImages.forEach((img) => {
      const imageUrl = img?.imageUrl || img;
      if (imageUrl) productImages.push(imageUrl);
    });
  }

  return (
    <div
      className={`${currentTheme.secondary} rounded-lg shadow-lg p-4 lg:p-6`}
    >
      <div className="flex justify-end mb-2">
        <Button variant="text" className="p-2">
          <ShareIcon className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Image Gallery */}
        <div className="lg:w-[55%]">
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:h-[400px] pb-2 lg:pb-0 lg:pr-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 lg:w-[64px] lg:h-[64px] rounded-md overflow-hidden flex-shrink-0 border-2 
                    ${
                      selectedImage === index
                        ? "border-yellow-500"
                        : "border-transparent"
                    }`}
                >
                  <img
                    src={image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden flex-1 lg:max-h-[400px]">
              <Magnifier
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                mgShape="square"
                mgWidth={150}
                mgHeight={150}
                zoomFactor={1.5}
              />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-[45%] lg:pt-8">
          <div className="flex flex-col mb-1">
            <Typography variant="h4" color="blue-gray">
              {product.name}
            </Typography>
            <p className="text-gray-600">{product.brand?.name}</p>
          </div>

          <div className="flex items-center gap-2 mb-6">
            {renderRating(4.5)}
            <Typography color="blue-gray" className="font-normal">
              (0 reviews)
            </Typography>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            {product.maxOfferPercentage > 0 ? (
              <>
                <Typography variant="h4" color="blue-gray">
                  ₹{product.sellingPrice}
                </Typography>
                <Typography color="gray" className="line-through">
                  ₹{product.price}
                </Typography>
                <Typography color="green" className="text-sm">
                  {product.maxOfferPercentage}% off
                </Typography>
              </>
            ) : (
              <Typography variant="h4" color="blue-gray">
                ₹{product.price}
              </Typography>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <Typography color="blue-gray" className="font-normal">
              {product.desc}
            </Typography>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 items-center">
            {product.stock > 0 ? (
              isInCart ? (
                <Button
                  color="blue"
                  variant="outlined"
                  className="flex items-center gap-2"
                  onClick={handleGoToCart}
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  Go to Cart
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  {isAdding ? "Adding..." : "Add to Cart"}
                </Button>
              )
            ) : (
              <Typography variant="h5" color="red">
                Out of Stock
              </Typography>
            )}
            <Button
              variant={isInWishlist ? "filled" : "outlined"}
              size="lg"
              color={isInWishlist ? "red" : "blue-gray"}
              className="flex items-center gap-2"
              onClick={handleWishlist}
            >
              {isInWishlist ? (
                <HeartSolid className="h-5 w-5" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
              {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
