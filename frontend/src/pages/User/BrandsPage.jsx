import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetAllBrandsQuery } from '../../../App/features/rtkApis/adminApi'
import { useSelector } from 'react-redux'
import Pagination from '../../components/Users/Pagination';

const BrandsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const { data, isLoading, isFetching, error } = useGetAllBrandsQuery({
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
        <p className={currentTheme.accent}>Error loading brands. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-[112px] ${currentTheme.primary}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold ${currentTheme.text} mb-8`}>Our Brands</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.brands?.map((brand) => (
            <div key={brand._id} className="group">
              <div className={`${currentTheme.secondary} rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1`}>
                <Link to={`/brand/${brand._id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={brand.logo.imageUrl}
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
          ))}
        </div>

        {(!data?.brands || data.brands.length === 0) && (
          <div className="text-center py-12">
            <p className={`text-lg ${currentTheme.textGray}`}>No brands available at the moment.</p>
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
  )
}

export default BrandsPage