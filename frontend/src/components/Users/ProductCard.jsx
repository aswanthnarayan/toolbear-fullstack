import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { HeartIcon } from '@heroicons/react/24/outline';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Button } from '@material-tailwind/react';
import { useAddToCartMutation } from '../../../App/features/rtkApis/userApi';

function ProductCard({ id, image, name, brand, rating, reviews, price,stock, description,toastMsg }) {
    const { isDarkMode, theme } = useSelector((state) => state.theme);
    const currentTheme = isDarkMode ? theme.dark : theme.light;
    const navigate = useNavigate();
    const [isInCart, setIsInCart] = useState(false);
    const [addToCart, { isLoading }] = useAddToCartMutation();

    // Calculate discounted price
    // const discountedPrice = offerPercentage > 0 
    //     ? Math.round(price - (price * offerPercentage / 100))
    //     : price;

    const handleAddToCart = async (e) => {
        e.preventDefault(); // Prevent navigation from Link
        try {
            await addToCart({ productId: id, quantity: 1 }).unwrap();
            setIsInCart(true);
            toastMsg('Product added to cart','success');

        } catch (error) {
            console.error('Failed to add to cart:', error);
            toastMsg(error.data.message,'error');
        }
    };

    const handleGoToCart = (e) => {
        e.preventDefault(); // Prevent navigation from Link
        navigate('/user/cart');
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
                    <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                            {stock > 0 ? (
                                isInCart ? (
                                    <Button
                                        color="blue"
                                        variant="outlined"
                                        className="flex items-center gap-2"
                                        onClick={handleGoToCart}
                                    >
                                        <ShoppingCartIcon className="h-4 w-4" />
                                        Go to Cart
                                    </Button>
                                ) : (
                                    <Button
                                        color="blue"
                                        className="flex items-center gap-2"
                                        onClick={handleAddToCart}
                                        disabled={isLoading}
                                    >
                                        <ShoppingCartIcon className="h-4 w-4" />
                                        {isLoading ? 'Adding...' : 'Add to Cart'}
                                    </Button>
                                )
                            ) : (
                                <p className={`text-xs font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                                    Out of Stock
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default ProductCard;
