import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { Breadcrumbs } from "@material-tailwind/react";
import { HomeIcon, FunnelIcon } from "@heroicons/react/24/outline";
import ProductCard from '../../components/Users/ProductCard'
import FilterSidebar from '../../components/Users/FilterSidebar'
import { useGetAllProductsQuery } from '../../../App/features/rtkApis/adminApi';
import { Spinner } from "@material-tailwind/react";
import {Toaster,toast} from 'sonner'
import SortSelect from '../../components/SortSelect';
import Pagination from '../../components/Users/Pagination';
import { useGetWishlistQuery } from '../../../App/features/rtkApis/userApi';

const AllProductsPage = () => {
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '');
  const [sortOption, setSortOption] = useState('newest');
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: null
  });
  const [showLgFilter, setShowLgFilter] = useState(false);

  const { data, isLoading, error } = useGetAllProductsQuery({
    page: currentPage,
    limit: 6,
    search: searchQuery,
    sort: sortOption,
    categories: filters.categories.join(','),
    brands: filters.brands.join(','),
    priceRange: filters.priceRange
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { refetch: refetchWishlist } = useGetWishlistQuery(undefined, {
    skip: !user
  });

  useEffect(() => {
    if (user) {
      refetchWishlist();
    }
  }, [user, refetchWishlist]);

  useEffect(() => {
    setSearchQuery(queryParams.get('search') || '');
  }, [location.search]);

  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  const handleToast = (message, type) => {
    toast[type](message);
  };

  const handleSortChange = (value) => {
    setSortOption(value);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  const handleApplyFilters = (newFilters) => {
    console.log('Applying filters:', newFilters);
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const isProductInWishlist = (productId) => {
    return wishlistItems.some(item => 
      item.productId._id === productId || item.productId === productId
    );
  };

  const handleWishlistChange = (productId, isAdded) => {
    // This will be called after successful wishlist operations
    // The state will be automatically updated through Redux
    refetchWishlist();
  };

  return (
    <div className={`min-h-screen pt-[112px] ${currentTheme.primary}`}>
      <div className="flex relative">
        {/* Filter Sidebar */}
        <div className={`hidden ${showLgFilter ? 'lg:block' : ''} sticky top-[112px] h-[calc(100vh-112px)] overflow-y-auto`}>
          <FilterSidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)}
            onApplyFilters={handleApplyFilters}
          />
        </div>
        
        {/* Mobile Filter Sidebar */}
        <div className="lg:hidden">
          <FilterSidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)}
            onApplyFilters={handleApplyFilters}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
            {/* Filter button for mobile */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden fixed bottom-4 right-4 z-30 bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full shadow-lg transition-colors duration-200 flex items-center gap-2"
            >
              <FunnelIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="hidden sm:inline">Filter</span>
            </button>

            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4'>
              <Breadcrumbs className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm text-sm sm:text-base`}>
                <Link to="/" className={`opacity-60 flex items-center gap-1 sm:gap-2 ${currentTheme.text}`}>
                  <HomeIcon className="h-3 w-3 sm:h-4 sm:w-4" /> Home
                </Link>
                <Link to="#" className={`${currentTheme.text}`}>
                  All Products
                </Link>
              </Breadcrumbs>
              <button 
                className={`hidden lg:block text-sm ${currentTheme.accent} ${currentTheme.accentHover} px-3 py-1.5 rounded-md transition-colors duration-200`} 
                onClick={() => setShowLgFilter(!showLgFilter)}
              >
                <span className="flex items-center gap-2">
                  <FunnelIcon className="h-4 w-4" />
                  {showLgFilter ? 'Hide Filter' : 'Show Filter'}
                </span>
              </button>
            </div>

            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mt-4 sm:mt-6'>
              <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${currentTheme.text}`}>All Products</h1>
              <div className="w-full sm:w-auto">
                <SortSelect onSortChange={handleSortChange} currentSort={sortOption} />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Spinner className="h-12 w-12" />
              </div>
            ) : error ? (
              <div className={`text-center ${currentTheme.text} bg-opacity-50 p-4 rounded-lg mt-4`}>
                Error loading products. Please try again later.
              </div>
            ) : (
              <>
                {data?.products.length === 0 && (
                  <div className={`text-center py-8 sm:py-12 ${currentTheme.text}`}>
                    <p className="text-base sm:text-lg">No products found.</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-4 sm:mt-6">
                  {data?.products
                    .filter(product => 
                      product.isListed && 
                      product.brand?.isListed && 
                      product.category?.isListed
                    )
                    .map((product) => (
                      <div key={product._id} className="w-full sm:max-w-[350px] mx-auto">
                        <ProductCard
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
                      </div>
                    ))}
                </div>

                {data?.totalPages > 0 && (
                  <div className="mt-6 sm:mt-8 lg:mt-10">
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={data.totalPages}
                      onPageChange={handlePageChange}
                    />
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
};

export default AllProductsPage