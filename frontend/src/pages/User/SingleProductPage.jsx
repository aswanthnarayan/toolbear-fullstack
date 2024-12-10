import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import SingleProduct from '../../components/Users/SingleProduct';
import { Breadcrumbs, Spinner } from '@material-tailwind/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useGetProductByIdQuery } from '../../../App/features/rtkApis/adminApi';
import { Toaster, toast } from 'sonner';

const SingleProductPage = () => {
  const { id } = useParams();
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);
 


  const handleToast = (message, type) => {
    toast[type](message);
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen pt-[112px] ${currentTheme.bg} flex items-center justify-center`}>
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen pt-[112px] ${currentTheme.bg} flex items-center justify-center`}>
        <div className="text-red-500">Error loading product. Please try again later.</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`min-h-screen pt-[112px] ${currentTheme.bg} flex items-center justify-center`}>
        <div className="text-gray-500">Product not found</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-[112px] ${currentTheme.bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs
            separator={<ChevronRightIcon className="h-4 w-4" />}
            className={`${isDarkMode ? 'bg-transparent' : 'bg-transparent'} p-0`}
          >
            <Link to="/" className="opacity-60 hover:text-yellow-500">
              Home
            </Link>
            <Link to="/user/all-products" className="opacity-60 hover:text-yellow-500">
              Products
            </Link>
            <Link 
              to={`/user/products/category/${product.category?.toLowerCase().replace(/\s+/g, '-')}`} 
              className="opacity-60 hover:text-yellow-500"
            >
              {product.category}
            </Link>
            <span className="cursor-default">
              {product.name}
            </span>
          </Breadcrumbs>
        </div>

        <SingleProduct product={product} toastMsg={handleToast}  />
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default SingleProductPage;