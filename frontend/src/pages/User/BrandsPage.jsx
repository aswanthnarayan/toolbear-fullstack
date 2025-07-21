import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetAllBrandsQuery } from '../../../App/features/rtkApis/adminApi'
import { useSelector } from 'react-redux'
import Pagination from '../../components/Users/Pagination';
import BrandCard from '../../components/Users/BrandCard';
import CustomSpinner from '../../components/utils/CustomSpinner';

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
      <CustomSpinner/>
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
            <BrandCard key={brand._id} brand={brand} />
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