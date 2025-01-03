import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BrandCard = ({ brand }) => {
    const { isDarkMode, theme } = useSelector((state) => state.theme);
    const currentTheme = isDarkMode ? theme.dark : theme.light;

    // Get the image URL from either logo.imageUrl or image field
    const imageUrl = brand.logo?.imageUrl || brand.image || brand.logo;

    return (
        <div className="group">
            <div className={`${currentTheme.secondary} rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1`}>
                <Link to={`/brand/${brand._id}`}>
                    <div className="relative h-48 overflow-hidden">
                        <img
                            src={imageUrl}
                            alt={brand.name}
                            className="w-full h-full object-fill object-center transform group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
                    </div>
                    
                    <div className="p-4">
                        <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>
                            {brand.name}
                        </h3>
                        <p className={`${currentTheme.textGray} text-sm line-clamp-2 mb-4`}>
                            {brand.description || 'Explore our collection of quality tools'}
                        </p>
                    </div>
                </Link>

                <div className="px-4 pb-4">
                    <div className="flex items-center justify-between gap-4">
                        <Link 
                            to={`/brand/${brand._id}`}
                            className="flex items-center text-blue-500 font-medium hover:text-blue-600"
                        >
                            View Products
                            <svg 
                                className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </Link>

                        <Link 
                            to={`/brand-store/${brand._id}`}
                            className="text-red-500 font-medium hover:text-red-600 flex items-center"
                        >
                            Visit Store
                            <svg
                                className="w-4 h-4 ml-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandCard;