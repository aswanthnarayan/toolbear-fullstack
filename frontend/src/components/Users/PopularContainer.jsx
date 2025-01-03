import React, { useEffect, useRef, useState } from 'react';
import { Typography } from "@material-tailwind/react";
import { useGetTopSellingItemsQuery, useGetWishlistQuery } from '../../../App/features/rtkApis/userApi';
import ProductCard from './ProductCard';
import CategoryCard from './CategoryCard';
import BrandCard from './BrandCard';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const PopularContainer = () => {
    const scrollContainerRef = useRef(null);
    const categoryContainerRef = useRef(null);
    const brandContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [canScrollLeftCategory, setCanScrollLeftCategory] = useState(false);
    const [canScrollRightCategory, setCanScrollRightCategory] = useState(true);
    const [canScrollLeftBrand, setCanScrollLeftBrand] = useState(false);
    const [canScrollRightBrand, setCanScrollRightBrand] = useState(true);
    const { data: topSellingData, isLoading } = useGetTopSellingItemsQuery();
    const { user } = useSelector((state) => state.auth);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const { data: wishlistData, refetch: refetchWishlist } = useGetWishlistQuery(undefined, {
        skip: !user
    });
    const { isDarkMode, theme } = useSelector((state) => state.theme);
    const currentTheme = isDarkMode ? theme.dark : theme.light;

    useEffect(() => {
        if (user) {
            refetchWishlist();
        }
    }, [user, refetchWishlist]);

    const isProductInWishlist = (productId) => {
        return wishlistItems.some(item => 
            item.productId._id === productId || item.productId === productId
        );
    };

    const handleWishlistChange = async (productId, isAdded) => {
        await refetchWishlist();
    };

    const handleToast = (message, type) => {
        toast[type](message, {
            duration: 2000,
            position: 'top-right'
        });
    };

    const checkScrollButtons = (container, setLeft, setRight) => {
        if (container) {
            setLeft(container.scrollLeft > 0);
            setRight(
                container.scrollLeft < container.scrollWidth - container.clientWidth
            );
        }
    };

    useEffect(() => {
        const productsContainer = scrollContainerRef.current;
        const categoriesContainer = categoryContainerRef.current;
        const brandsContainer = brandContainerRef.current;

        const handleProductsScroll = () => checkScrollButtons(productsContainer, setCanScrollLeft, setCanScrollRight);
        const handleCategoriesScroll = () => checkScrollButtons(categoriesContainer, setCanScrollLeftCategory, setCanScrollRightCategory);
        const handleBrandsScroll = () => checkScrollButtons(brandsContainer, setCanScrollLeftBrand, setCanScrollRightBrand);

        if (productsContainer) {
            productsContainer.addEventListener('scroll', handleProductsScroll);
            handleProductsScroll();
        }

        if (categoriesContainer) {
            categoriesContainer.addEventListener('scroll', handleCategoriesScroll);
            handleCategoriesScroll();
        }

        if (brandsContainer) {
            brandsContainer.addEventListener('scroll', handleBrandsScroll);
            handleBrandsScroll();
        }

        return () => {
            if (productsContainer) {
                productsContainer.removeEventListener('scroll', handleProductsScroll);
            }
            if (categoriesContainer) {
                categoriesContainer.removeEventListener('scroll', handleCategoriesScroll);
            }
            if (brandsContainer) {
                brandsContainer.removeEventListener('scroll', handleBrandsScroll);
            }
        };
    }, []);

    const scroll = (direction, containerRef) => {
        const container = containerRef.current;
        if (container) {
            const scrollAmount = 300;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    const renderProducts = () => (
        <div className="container mx-auto px-4">
            <Typography variant="h3" className={`mb-6 ${currentTheme.text}`}>
                Popular Products
            </Typography>
            <div className="relative group">
                {canScrollLeft && (
                    <button 
                        onClick={() => scroll('left', scrollContainerRef)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-all duration-200 transform -translate-x-1/2"
                        aria-label="Scroll left"
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                )}

                <div 
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-hidden scroll-smooth pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {topSellingData?.data?.products.map((product) => (
                        <div key={product._id} className="flex-none w-[300px]">
                            <ProductCard
                                id={product._id}
                                image={product.image}
                                name={product.name}
                                brand={product.brand}
                                price={product.price}
                                description={product.description}
                                rating={4.5}
                                reviews={128}
                                maxOfferPercentage={product.maxOfferPercentage || 0}
                                sellingPrice={product.sellingPrice || product.price}
                                stock={product.stock || 0}
                                toastMsg={handleToast}
                                isInWishlist={isProductInWishlist(product._id)}
                                onWishlistChange={handleWishlistChange}
                            />
                        </div>
                    ))}
                </div>

                {canScrollRight && (
                    <button 
                        onClick={() => scroll('right', scrollContainerRef)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-all duration-200 transform translate-x-1/2"
                        aria-label="Scroll right"
                    >
                        <ChevronRightIcon className="h-6 w-6" />
                    </button>
                )}
            </div>
        </div>
    );

    const renderCategories = () => (
        <div className="container mx-auto px-4 mt-12">
            <Typography variant="h3" className={`mb-6 ${currentTheme.text}`}>
                Popular Categories
            </Typography>
            <div className="relative group">
                {canScrollLeftCategory && (
                    <button 
                        onClick={() => scroll('left', categoryContainerRef)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-all duration-200 transform -translate-x-1/2"
                        aria-label="Scroll left"
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                )}

                <div 
                    ref={categoryContainerRef}
                    className="flex gap-4 overflow-x-hidden scroll-smooth pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {topSellingData?.data?.categories.map((category) => (
                        <div key={category._id} className="flex-none w-[300px]">
                            <CategoryCard category={category} />
                        </div>
                    ))}
                </div>

                {canScrollRightCategory && (
                    <button 
                        onClick={() => scroll('right', categoryContainerRef)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-all duration-200 transform translate-x-1/2"
                        aria-label="Scroll right"
                    >
                        <ChevronRightIcon className="h-6 w-6" />
                    </button>
                )}
            </div>
        </div>
    );

    const renderBrands = () => (
        <div className="container mx-auto px-4 mt-12">
            <Typography variant="h3" className={`mb-6 ${currentTheme.text}`}>
                Popular Brands
            </Typography>
            <div className="relative group">
                {canScrollLeftBrand && (
                    <button 
                        onClick={() => scroll('left', brandContainerRef)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-all duration-200 transform -translate-x-1/2"
                        aria-label="Scroll left"
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                )}

                <div 
                    ref={brandContainerRef}
                    className="flex gap-4 overflow-x-hidden scroll-smooth pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {topSellingData?.data?.brands.map((brand) => (
                        <div key={brand._id} className="flex-none w-[300px]">
                            <BrandCard brand={brand} />
                        </div>
                    ))}
                </div>

                {canScrollRightBrand && (
                    <button 
                        onClick={() => scroll('right', brandContainerRef)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-all duration-200 transform translate-x-1/2"
                        aria-label="Scroll right"
                    >
                        <ChevronRightIcon className="h-6 w-6" />
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-12">
            {topSellingData?.data?.products?.length > 0 && renderProducts()}
            {topSellingData?.data?.categories?.length > 0 && renderCategories()}
            {topSellingData?.data?.brands?.length > 0 && renderBrands()}
        </div>
    );
};

export default PopularContainer;