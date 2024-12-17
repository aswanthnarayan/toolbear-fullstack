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
            toastMsg(error.data.message, "error");
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
                ? `${currentTheme.secondary} shadow-gray-700`
                : 'bg-white shadow-lg'
        }`}>
            <Link to={`/user/products/${id}`}>
                <div className="relative">
                    <img
                        className="w-full h-48 object-cover hover:opacity-95 transition-opacity"
                        src={image}
                        alt={`Image of ${name}`}
                    />
                </div>
                <div className="p-4">
                    <h2 className={`text-lg font-bold mb-2 line-clamp-1 hover:line-clamp-none ${
                        currentTheme.text
                    }`}>{name}</h2>
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {brand}
                    </p>
                    <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 mr-2">
                            {Array.from({ length: 5 }, (_, i) => (
                                <span key={i} className="w-4 h-4">
                                    {i < Math.floor(rating) ? (
                                        <StarSolid className="w-full h-full" />
                                    ) : (
                                        <StarOutline className="w-full h-full" />
                                    )}
                                </span>
                            ))}
                        </div>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {rating} · {reviews} reviews
                        </span>
                    </div>
                    <div className="flex items-baseline mb-2">
                        <span className={`text-xl font-bold ${currentTheme.text}`}>₹{price}</span>
                        {/* {offerPercentage > 0 && (
                            <>
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                    ₹{price}
                                </span>
                                <span className="ml-2 text-xs text-green-600 font-medium">
                                    {offerPercentage}% off
                                </span>
                            </>
                        )} */}
                    </div>
                    <p className={`text-xs mb-3 line-clamp-2 hover:line-clamp-none ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        {description}
                    </p>
                    <div className="mt-4 flex justify-between items-center h-10 gap-2">
                        {stock > 0 ? (
                            <>
                                <Button
                                    color={isInWishlist ? "red" : "gray"}
                                    variant="outlined"
                                    className="flex items-center justify-center gap-2 min-w-[40px] p-2"
                                    onClick={handleWishlist}
                                >
                                    {isInWishlist ? (
                                        <HeartSolid className="w-5 h-5 text-red-500" />
                                    ) : (
                                        <HeartOutline className="w-5 h-5" />
                                    )}
                                </Button>
                                <div className="flex-1">
                                    {isInCart ? (
                                        <Button
                                            color="blue"
                                            variant="outlined"
                                            className="flex items-center justify-center gap-2 w-full py-2"
                                            onClick={handleGoToCart}
                                            disabled={isLoading}
                                        >
                                            <ShoppingCartIcon className="w-4 h-4" />
                                            Go to Cart
                                        </Button>
                                    ) : (
                                        <Button
                                            color="blue"
                                            variant="gradient"
                                            className="flex items-center justify-center gap-2 w-full py-2"
                                            onClick={handleAddToCart}
                                            disabled={isLoading}
                                        >
                                            <ShoppingCartIcon className="w-4 h-4" />
                                            Add to Cart
                                        </Button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Button
                                color="red"
                                variant="text"
                                className="w-full py-2"
                                disabled
                            >
                                Out of Stock
                            </Button>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default ProductCard;
