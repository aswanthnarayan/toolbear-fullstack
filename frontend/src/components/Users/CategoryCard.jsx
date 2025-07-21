import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CategoryCard = ({ category }) => {
    const { isDarkMode, theme } = useSelector((state) => state.theme);
    const currentTheme = isDarkMode ? theme.dark : theme.light;

    return (
        <Link 
            to={`/category/${category._id}`} 
            className="group"
        >
            <div className={`${currentTheme.secondary} rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1`}>
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-4">
                    <h3 className={`text-xl font-semibold ${currentTheme.text} mb-2`}>
                        {category.name}
                    </h3>
                    <p className={`${currentTheme.textGray} text-sm line-clamp-2`}>
                        {category.desc || 'Explore our collection of tools and equipment'}
                    </p>
                    
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-blue-500 font-medium">
                            View Products
                        </span>
                        <svg 
                            className="w-5 h-5 text-blue-500 transform group-hover:translate-x-1 transition-transform duration-300" 
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
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;