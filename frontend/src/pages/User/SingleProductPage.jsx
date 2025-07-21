import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import SingleProduct from '../../components/Users/SingleProduct';
import RelatedProducts from '../../components/Users/RelatedProducts';
import { Breadcrumbs, Typography } from '@material-tailwind/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useGetProductByIdQuery } from '../../../App/features/rtkApis/adminApi';
import { Toaster, toast } from 'sonner';
import ReviewSection from '../../components/Users/ReviewSection';
import CustomSpinner from '../../components/utils/CustomSpinner';

const SingleProductPage = () => {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { id } = useParams();
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);

  const isProductInWishlist = (productId) => {
    return wishlistItems.some(item => 
      item.productId._id === productId || item.productId === productId
    );
  };

  const handleToast = (message, type) => {
    toast[type](message);
  };

  if (isLoading) {
    return (
     <CustomSpinner/>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen pt-[112px] ${currentTheme.primary} flex items-center justify-center`}>
        <div className={currentTheme.accent}>Error loading product. Please try again later.</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`min-h-screen pt-[112px] ${currentTheme.primary} flex items-center justify-center`}>
        <div className={currentTheme.textGray}>Product not found</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-[112px] ${currentTheme.primary}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumbs */}
        <div className="mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap">
          <Breadcrumbs
            separator={<ChevronRightIcon className={`h-3 w-3 sm:h-4 sm:w-4 ${currentTheme.text}`} />}
            className={`bg-transparent p-0`}
          >
            <Link to="/" className={`${currentTheme.text} text-sm sm:text-base opacity-60 hover:text-blue-500`}>
              Home
            </Link>
            <Link to="/user/all-products" className={`${currentTheme.text} text-sm sm:text-base opacity-60 hover:text-blue-500`}>
              Products
            </Link>
            <Link 
              to={`/category/${product.category?._id}`} 
              className={`${currentTheme.text} text-sm sm:text-base opacity-60 hover:text-blue-500`}
            >
              {product.category?.name}
            </Link>
            <span className={`cursor-default ${currentTheme.text} text-sm sm:text-base`}>
              {product.name}
            </span>
          </Breadcrumbs>
        </div>

        <SingleProduct product={product} toastMsg={handleToast} isInWishlist={isProductInWishlist(product._id)} />
        
        <div className="mt-6 sm:mt-8 lg:mt-12">
          <RelatedProducts 
            category={product.category} 
            currentProductId={product._id}
            onToast={handleToast}
          />
        </div>

        {/* Product Specifications Section */}
        {product.specifications && (
          <div className={`mt-6 sm:mt-8 lg:mt-12 ${currentTheme.secondary} rounded-lg shadow-lg p-4 sm:p-6`}>
            <Typography variant="h4" className={`mb-4 sm:mb-6 ${currentTheme.text} text-xl sm:text-2xl`}>
              Product Specifications
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div 
                  key={key} 
                  className={`p-3 sm:p-4 rounded-lg ${currentTheme.secondary} hover:shadow-md transition-shadow duration-300`}
                >
                  <Typography variant="small" className={`${currentTheme.textGray} capitalize mb-1 text-sm sm:text-base`}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Typography>
                  <Typography className={`font-medium ${currentTheme.text} text-sm sm:text-base`}>
                    {value}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 sm:mt-8 lg:mt-12">
          <ReviewSection productId={product._id}/>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default SingleProductPage;