import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetAllCategoriesQuery } from '../../../App/features/rtkApis/adminApi'
import { useSelector } from 'react-redux'
import Pagination from '../../components/Users/Pagination';

const CategoriesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const { data, isLoading, isFetching, error } = useGetAllCategoriesQuery({
    page: currentPage,
    limit: 8,
    isUserView: true
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading || isFetching) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${currentTheme.primary}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${currentTheme.primary}`}>
        <p className={currentTheme.accent}>Error loading categories. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-[112px] ${currentTheme.primary}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold ${currentTheme.text} mb-8`}>Our Categories</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.categories?.map((category) => (
            <Link 
              to={`/category/${category._id}`} 
              key={category._id}
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
          ))}
        </div>

        {(!data?.categories || data.categories.length === 0) && (
          <div className="text-center py-12">
            <p className={`text-lg ${currentTheme.textGray}`}>No categories available at the moment.</p>
          </div>
        )}

        {data?.totalPages > 0 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

export default CategoriesPage