import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { HeartIcon } from '@heroicons/react/24/outline';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

function ProductCard({ id, image, name, brand, rating, reviews, price, description, offerPercentage = 0 }) {
    const { isDarkMode, theme } = useSelector((state) => state.theme);
    const currentTheme = isDarkMode ? theme.dark : theme.light;

    // Calculate discounted price
    const discountedPrice = offerPercentage > 0 
        ? Math.round(price - (price * offerPercentage / 100))
        : price;

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
                        <span className={`text-xl font-bold ${currentTheme.text}`}>₹{discountedPrice}</span>
                        {offerPercentage > 0 && (
                            <>
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                    ₹{price}
                                </span>
                                <span className="ml-2 text-xs text-green-600 font-medium">
                                    {offerPercentage}% off
                                </span>
                            </>
                        )}
                    </div>
                    <p className={`text-xs mb-3 line-clamp-2 hover:line-clamp-none ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        {description}
                    </p>
                    <div className="flex gap-2">
                        <button className={`flex-1 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
                            isDarkMode 
                                ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'
                                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        }`}>
                            <ShoppingCartIcon className="w-5 h-5" />
                            <span className="text-sm">Add to Cart</span>
                        </button>
                        <button className={`px-4 py-2 rounded-lg transition-colors ${
                            isDarkMode 
                                ? 'bg-gray-800 hover:bg-gray-700'
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}>
                            <HeartIcon className={`w-5 h-5 ${
                                isDarkMode 
                                    ? 'text-gray-300 hover:text-red-400'
                                    : 'text-gray-600 hover:text-red-500'
                            } transition-colors`} />
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default ProductCard;
