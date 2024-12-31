import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams, useLocation, useSearchParams } from 'react-router-dom'
import { Breadcrumbs } from "@material-tailwind/react";
import { HomeIcon } from "@heroicons/react/24/outline";
import ProductCard from '../../components/Users/ProductCard'
import { 
  useGetAllProductsQuery, 
  useGetCategoryByIdQuery,
  useGetBrandByIdQuery 
} from '../../../App/features/rtkApis/adminApi';
import { Spinner } from "@material-tailwind/react";
import {Toaster,toast} from 'sonner'
import SortSelect from '../../components/SortSelect';
import { useGetWishlistQuery } from '../../../App/features/rtkApis/userApi';

const FilterdCatefgoryOrBrandPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const brandId = searchParams.get('brand');
  
  const filterType = location.pathname.includes('/category/') ? 'category' : 'brand';
  const isFromBrandStore = filterType === 'category' && brandId;
  
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('newest');

  // Always fetch category data if we have an ID
  const { 
    data: categoryData,
    isLoading: categoryLoading 
  } = useGetCategoryByIdQuery(id, {
    skip: !id
  });
  
  // Always fetch brand data if we have a brandId
  const { 
    data: brandData,
    isLoading: brandLoading 
  } = useGetBrandByIdQuery(brandId || id, {
    skip: !brandId && filterType !== 'brand'
  });

  

  // Get the title and filter params based on type
  const getFilterParams = () => {
    if (isFromBrandStore) {
      return {
        title: categoryData && brandData 
          ? `${brandData.name || ''} ${categoryData.name}`
          : 'Products',
        filterParams: { 
          categories: id,
          brands: brandId
        }
      };
    }
    if (filterType === 'category') {
      return {
        title: categoryData?.name || 'Category Products',
        filterParams: { categories: id }
      };
    }
    return {
      title: brandData?.name || 'Brand Products',
      filterParams: { brands: id }
    };
  };

  const { title, filterParams } = getFilterParams();

  // Fetch products with filters
  const { data: productsData, isLoading: productsLoading, error } = useGetAllProductsQuery({
    ...filterParams,
    page: currentPage,
    sort: sortOption,
    limit: 12
  });

  const { refetch: refetchWishlist } = useGetWishlistQuery(undefined, {
    skip: !user
  });

  useEffect(() => {
    if (user) {
      refetchWishlist();
    }
  }, [user, refetchWishlist]);

  const handleLoadMore = () => {
    if (productsData?.hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleSortChange = (value) => {
    setSortOption(value);
    setCurrentPage(1);
  };

  const isProductInWishlist = (productId) => {
    return wishlistItems.some(item => 
      item.productId._id === productId || item.productId === productId
    );
  };

  const handleWishlistChange = () => {
    refetchWishlist();
  };

  const handleToast = (message, type) => {
    toast[type](message);
  };

  return (
    <div className={`min-h-screen pt-[112px] ${currentTheme.primary}`}>
      <div className="flex relative">
        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-[1920px] mx-auto px-4 py-8">
            <div className='flex justify-between items-center'>
              <Breadcrumbs className="bg-transparent p-0">
                <Link to="/" className={`${currentTheme.text} opacity-60 flex items-center gap-2 hover:text-blue-500`}>
                  <HomeIcon className="h-4 w-4" /> Home
                </Link>
                <Link 
                  to={filterType === 'category' ? "/user/categories" : "/user/brands"} 
                  className={`${currentTheme.text} opacity-60 hover:text-blue-500`}
                >
                  {filterType === 'category' ? 'Categories' : 'Brands'}
                </Link>
                <Link to="#" className={currentTheme.text}>
                  {title}
                </Link>
              </Breadcrumbs>
            </div>

            <div className='flex justify-between items-center'>
              <h1 className={`text-3xl font-bold my-6 ${currentTheme.text}`}>
                {title}
              </h1>
              <SortSelect onSortChange={handleSortChange} currentSort={sortOption} />
            </div>

            {productsLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
              </div>
            ) : error ? (
              <div className={`text-center ${currentTheme.accent} my-8`}>
                Error loading products. Please try again later.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {productsData?.products.map((product) => (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      image={product.mainImage?.imageUrl || product.mainImage}
                      name={product.name}
                      brand={product.brand?.name || 'Unknown Brand'}
                      rating={4.5}
                      reviews={128}
                      price={product.price}
                      maxOfferPercentage={product.maxOfferPercentage}
                      sellingPrice={product.sellingPrice}
                      description={product.desc}
                      stock={product.stock}
                      isInWishlist={isProductInWishlist(product._id)}
                      onWishlistChange={handleWishlistChange}
                      toastMsg={handleToast}
                    />
                  ))}
                </div>

                {productsData?.products.length === 0 && (
                  <div className="text-center py-12">
                    <p className={`text-lg ${currentTheme.text}`}>
                      No products found in this {filterType}.
                    </p>
                  </div>
                )}

                {productsData?.hasMore && (
                  <div className="text-center mt-8">
                    <button
                      onClick={handleLoadMore}
                      className={`${currentTheme.button} ${currentTheme.buttonHover} text-black px-6 py-2 rounded-md transition-colors`}
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default FilterdCatefgoryOrBrandPage