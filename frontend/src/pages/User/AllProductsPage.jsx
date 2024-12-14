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

const AllProductsPage = () => {
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
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

  const { data, isLoading, isFetching, error } = useGetAllProductsQuery({
    page: currentPage,
    limit: 12,
    search: searchQuery,
    sort: sortOption,
    categories: filters.categories.join(','),
    brands: filters.brands.join(','),
    priceRange: filters.priceRange
  });

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

  const handleLoadMore = () => {
    if (data?.hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

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

  return (
    <div className={`min-h-screen pt-[112px] ${currentTheme.bg}`}>
      <div className="flex relative">
        {/* Filter Sidebar */}
        <div className="hidden lg:block sticky top-[112px]">
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
        <div className="flex-1">
          <div className="max-w-[1920px] mx-auto px-4 py-8">
            {/* Filter button for mobile */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden fixed bottom-4 right-4 z-30 bg-yellow-500 text-white p-3 rounded-full shadow-lg"
            >
              <FunnelIcon className="h-6 w-6" />
            </button>

            <Breadcrumbs className="bg-transparent">
              <Link to="/" className="opacity-60 flex items-center gap-2">
                <HomeIcon className="h-4 w-4" /> Home
              </Link>
              <Link to="#" className={currentTheme.text}>
                All Products
              </Link>
            </Breadcrumbs>
            <div className='flex justify-between items-center'>
            <h1 className={`text-3xl font-bold my-6 ${currentTheme.text}`}>All Products</h1>
            <SortSelect onSortChange={handleSortChange} currentSort={sortOption} />
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Spinner className="h-12 w-12" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500">
                Error loading products. Please try again later.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {data?.products
                    .filter(product => 
                      product.isListed && 
                      product.brand?.isListed && 
                      product.category?.isListed
                    )
                    .map((product) => (
                      <div key={product._id} className="w-full max-w-[350px] mx-auto">
                        <ProductCard
                          id={product._id}
                          image={product.mainImage?.imageUrl || product.mainImage}
                          name={product.name}
                          brand={product.brand?.name || 'Unknown Brand'}
                          rating={4.5}
                          reviews={128}
                          price={product.price}
                          description={product.desc}
                          stock={product.stock}
                          // offerPercentage={product.offerPercentage}
                          toastMsg={handleToast}
                        />
                      </div>
                    ))}
                </div>

                {/* {data?.hasMore && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={handleLoadMore}
                      disabled={isFetching}
                      className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                    >
                      {isFetching ? (
                        <Spinner className="h-5 w-5" />
                      ) : (
                        'Load More'
                      )}
                    </button>
                  </div>
                )} */}
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