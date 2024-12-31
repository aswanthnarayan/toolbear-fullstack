import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Button } from '@material-tailwind/react';
import { 
    useAddToCartMutation,
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation
} from '../../../App/features/rtkApis/userApi';

function ProductCard({ 
    id, 
    image, 
    name, 
    brand, 
    rating, 
    reviews, 
    price,
    maxOfferPercentage,
    sellingPrice, 
    stock, 
    description, 
    toastMsg,
    isInWishlist,
    onWishlistChange 
}) {
    const { isDarkMode, theme } = useSelector((state) => state.theme);
    const { user } = useSelector((state) => state.auth);
    const currentTheme = isDarkMode ? theme.dark : theme.light;
    const navigate = useNavigate();
    const [isInCart, setIsInCart] = useState(false);
    const [addToCart, { isLoading }] = useAddToCartMutation();
    const [addToWishlist] = useAddToWishlistMutation();
    const [removeFromWishlist] = useRemoveFromWishlistMutation();
    
    const handleAddToCart = async (e) => {
        e.preventDefault();
        try {
            await addToCart({ productId: id, quantity: 1 }).unwrap();
            setIsInCart(true);
            toastMsg('Product added to cart', "success");
        } catch (error) {
            console.error('Failed to add to cart:', error);
            if(error?.status === 401) {
                toastMsg('Login to add product to cart', "error");
            }else
            {
            toastMsg(error.data.message, "error");
            }
        }
    };

    const handleGoToCart = (e) => {
        e.preventDefault();
        navigate('/user/cart');
    };

    const handleWishlist = async (e) => {
        e.preventDefault();
        if (!user) {
            toastMsg('Login to add product to wishlist', "error");
            return;
        }
        try {
            if (isInWishlist) {
                await removeFromWishlist(id).unwrap();
                onWishlistChange && onWishlistChange(id, false);
                toastMsg('Removed from wishlist', "success");
            } else {
                await addToWishlist({ productId: id }).unwrap();
                onWishlistChange && onWishlistChange(id, true);
                toastMsg('Added to wishlist', "success");
            }
        } catch (error) {
            console.error('Wishlist operation failed:', error);
            if(error?.status === 401) {
                toastMsg('Login to add product to wishlist', "error");
            } else {
                toastMsg(error.data?.message || 'Wishlist operation failed', "error");
            }
        }
    };

    return (
        <div className={`w-full mx-auto rounded-xl overflow-hidden transform transition duration-300 hover:scale-105 ${
            isDarkMode 
                ? `${currentTheme.secondary} shadow-md shadow-gray-800/50`
                : 'bg-white shadow-lg hover:shadow-xl'
        }`}>
            <Link to={`/user/products/${id}`}>
                <div className="relative">
                    <img
                        className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                        src={image}
                        alt={`Image of ${name}`}
                    />
                </div>
                <div className="p-4">
                    <h2 className={`text-lg font-bold mb-2 line-clamp-1 ${currentTheme.text}`}>
                        {name}
                    </h2>
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {brand}
                    </p>
                    <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, index) => (
                            index < Math.floor(rating) ? (
                                <StarSolid key={index} className="h-4 w-4 text-yellow-500" />
                            ) : (
                                <StarOutline key={index} className="h-4 w-4 text-yellow-500" />
                            )
                        ))}
                        <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            ({reviews})
                        </span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className={`text-lg font-bold ${currentTheme.text}`}>
                            ₹{sellingPrice}
                        </span>
                        {maxOfferPercentage > 0 && (
                            <span className="flex items-center gap-1">
                                <span className={`text-sm line-through ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                    ₹{price}
                                </span>
                                <span className="text-sm text-green-500 font-medium">
                                    {maxOfferPercentage}% off
                                </span>
                            </span>
                        )}
                    </div>
                    <p className={`text-xs mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {description}
                    </p>
                    <div className="flex gap-2 mt-4">
                        {stock > 0 ? (
                            isInCart ? (
                                <Button
                                    size="sm"
                                    className={`flex-1 ${currentTheme.button} ${currentTheme.buttonHover} text-white gap-2 flex items-center justify-center`}
                                    onClick={handleGoToCart}
                                >
                                    <ShoppingCartIcon className="h-4 w-4" />
                                    Go to Cart
                                </Button>
                            ) : (
                                <Button
                                    size="sm"
                                    className={`flex-1 ${currentTheme.button} ${currentTheme.buttonHover} text-black gap-2 flex items-center justify-center`}
                                    onClick={handleAddToCart}
                                    disabled={isLoading}
                                >
                                    <ShoppingCartIcon className="h-4 w-4" />
                                    Add to Cart
                                </Button>
                            )
                        ) : (
                            <Button
                                size="sm"
                                disabled
                                className="flex-1 bg-gray-300 text-gray-600 gap-2 flex items-center justify-center cursor-not-allowed"
                            >
                                Out of Stock
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="text"
                            className={`p-2 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                            onClick={handleWishlist}
                        >
                            {isInWishlist ? (
                                <HeartSolid className="h-5 w-5 text-red-500" />
                            ) : (
                                <HeartOutline className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default ProductCard;
