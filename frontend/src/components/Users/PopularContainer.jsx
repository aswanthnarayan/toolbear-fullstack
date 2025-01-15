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

    useEffect(() => {
        // Check scroll buttons when component mounts and when data changes
        if (scrollContainerRef.current) {
            checkScrollButtons(scrollContainerRef.current, setCanScrollLeft, setCanScrollRight);
        }
        if (categoryContainerRef.current) {
            checkScrollButtons(categoryContainerRef.current, setCanScrollLeftCategory, setCanScrollRightCategory);
        }
        if (brandContainerRef.current) {
            checkScrollButtons(brandContainerRef.current, setCanScrollLeftBrand, setCanScrollRightBrand);
        }
    }, [topSellingData]);

    useEffect(() => {
        // Add window resize listener
        const handleResize = () => {
            if (scrollContainerRef.current) {
                checkScrollButtons(scrollContainerRef.current, setCanScrollLeft, setCanScrollRight);
            }
            if (categoryContainerRef.current) {
                checkScrollButtons(categoryContainerRef.current, setCanScrollLeftCategory, setCanScrollRightCategory);
            }
            if (brandContainerRef.current) {
                checkScrollButtons(brandContainerRef.current, setCanScrollLeftBrand, setCanScrollRightBrand);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            const threshold = 5; // Small threshold for rounding errors
            const maxScroll = container.scrollWidth - container.clientWidth;
            
            setLeft(container.scrollLeft > threshold);
            setRight(container.scrollLeft < maxScroll - threshold);
        }
    };

    const scroll = (direction, containerRef) => {
        const container = containerRef.current;
        if (container) {
            const containerWidth = container.clientWidth;
            const scrollAmount = direction === 'left' ? -containerWidth : containerWidth;
            
            container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });

            // Update scroll buttons after animation
            setTimeout(() => {
                if (containerRef === scrollContainerRef) {
                    checkScrollButtons(container, setCanScrollLeft, setCanScrollRight);
                } else if (containerRef === categoryContainerRef) {
                    checkScrollButtons(container, setCanScrollLeftCategory, setCanScrollRightCategory);
                } else if (containerRef === brandContainerRef) {
                    checkScrollButtons(container, setCanScrollLeftBrand, setCanScrollRightBrand);
                }
            }, 500);
        }
    };

    const renderScrollContainer = (title, items, containerRef, canScrollLeft, canScrollRight, renderItem) => (
        <div className="w-full px-4">
            <Typography variant="h3" className={`mb-6 ${currentTheme.text}`}>
                {title}
            </Typography>
            <div className="relative">
                {/* Left scroll button */}
                <button 
                    onClick={() => scroll('left', containerRef)}
                    className={`absolute -left-3 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 rounded-full shadow-lg p-2 transition-all duration-200 
                        ${canScrollLeft ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                    disabled={!canScrollLeft}
                    aria-label="Scroll left"
                >
                    <ChevronLeftIcon className="h-6 w-6 text-gray-800 dark:text-white" />
                </button>

                {/* Scroll container */}
                <div 
                    ref={containerRef}
                    className="grid grid-flow-col auto-cols-[100%] sm:auto-cols-[calc(50%-12px)] md:auto-cols-[calc(33.333%-16px)] lg:auto-cols-[calc(25%-18px)] gap-6 overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar"
                    style={{ 
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    {items?.map((item) => (
                        <div 
                            key={item._id} 
                            className="w-full snap-start"
                        >
                            {renderItem(item)}
                        </div>
                    ))}
                </div>

                {/* Right scroll button */}
                <button 
                    onClick={() => scroll('right', containerRef)}
                    className={`absolute -right-3 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 rounded-full shadow-lg p-2 transition-all duration-200 
                        ${canScrollRight ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                    disabled={!canScrollRight}
                    aria-label="Scroll right"
                >
                    <ChevronRightIcon className="h-6 w-6 text-gray-800 dark:text-white" />
                </button>
            </div>
        </div>
    );

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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {topSellingData?.data?.products?.length > 0 && renderScrollContainer(
                'Popular Products',
                topSellingData.data.products,
                scrollContainerRef,
                canScrollLeft,
                canScrollRight,
                (product) => (
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
                )
            )}
            {topSellingData?.data?.categories?.length > 0 && renderScrollContainer(
                'Popular Categories',
                topSellingData.data.categories,
                categoryContainerRef,
                canScrollLeftCategory,
                canScrollRightCategory,
                (category) => (
                    <CategoryCard category={category} />
                )
            )}
            {topSellingData?.data?.brands?.length > 0 && renderScrollContainer(
                'Popular Brands',
                topSellingData.data.brands,
                brandContainerRef,
                canScrollLeftBrand,
                canScrollRightBrand,
                (brand) => (
                    <BrandCard brand={brand} />
                )
            )}
        </div>
    );
};

export default PopularContainer;