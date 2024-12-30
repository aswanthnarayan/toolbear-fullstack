import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ 
    baseUrl: '/api/admin',
    credentials: 'include',
    prepareHeaders: (headers) => {
        if (headers.get('Content-Type')?.includes('multipart/form-data')) {
            headers.delete('Content-Type');
        }
        return headers;
    }
});

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery,
    tagTypes: ['Users', 'Categories', 'Brands', 'Products', 'Orders', 'Coupons', 'Banners'],
    endpoints: (builder) => ({
        //User management
        getUsers: builder.query({
            query: ({ page = 1, limit = 10, search = '' }) => ({
                url: '/all-users',
                params: { page, limit, search }
            }),
            providesTags: ['Users'],
            transformResponse: (response) => ({
                users: response.users,
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                totalUsers: response.totalUsers,
                hasNextPage: response.hasNextPage,
                hasPrevPage: response.hasPrevPage
            })
        }),
        toggleBlockUser: builder.mutation({
            query: (userId) => ({
                url: `/users/${userId}/toggle-block`,
                method: 'PATCH'
            }),
            invalidatesTags: ['Users']
        }),
        //Category management
        createCategory: builder.mutation({
            query: (formData) => ({
                url: '/categories/new',
                method: 'POST',
                body: formData,
                formData: true,
                // timeout: 10000,
            }),
            invalidatesTags: ['Categories'],
        }),
        getAllCategories: builder.query({
            query: ({ page = 1, limit = 8, search = '', isUserView = false }) => ({
                url: '/categories',
                params: { page, limit, search, isUserView }
            }),
            providesTags: ['Categories'],
            transformResponse: (response) => ({
                categories: response.categories,
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                totalCategories: response.totalCategories,
                hasNextPage: response.hasNextPage,
                hasPrevPage: response.hasPrevPage
            })
        }),
        updateCategory: builder.mutation({
            query: ({ categoryId, formData }) => ({
                url: `/categories/${categoryId}/update`,
                method: 'PATCH',
                body: formData,
                formData: true,
                // timeout: 10000,
            }),
            invalidatesTags: ['Categories'],
        }),
        
        toggleListCategory: builder.mutation({
            query: (categoryId) => ({
                url: `/categories/${categoryId}/toggle-list`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Categories'],
        }),
        getCategoryById: builder.query({
            query: (categoryId) => `/categories/${categoryId}`,
            providesTags: ['Categories'],
        }),
        //Brand management
        createBrand: builder.mutation({
            query: (formData) => ({
                url: '/brands/new',
                method: 'POST',
                body: formData,
                formData: true,
                // timeout: 10000,
            }),
            invalidatesTags: ['Brands'],
        }),
        getAllBrands: builder.query({
            query: ({ page = 1, limit = 10, search = '' }) => ({
                url: '/brands',
                params: { page, limit, search }
            }),
            providesTags: ['Brands'],
            transformResponse: (response) => ({
                brands: response.brands,
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                totalBrands: response.totalCount,
                hasMore: response.hasMore
            })
        }),
        updateBrand: builder.mutation({
            query: ({ brandId, formData }) => ({
                url: `/brands/${brandId}/update`,
                method: 'PATCH',
                body: formData,
                formData: true,
                // timeout: 10000,
            }),
            invalidatesTags: ['Brands'],
        }),
        toggleListBrand: builder.mutation({
            query: (brandId) => ({
                url: `/brands/${brandId}/toggle-list`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Brands'],
        }),
        getBrandById: builder.query({
            query: (brandId) => `/brands/${brandId}`,
            providesTags: ['Brands'],
        }),
        //Product management
        createProduct: builder.mutation({
            query: (formData) => ({
                url: '/products/new',
                method: 'POST',
                body: formData,
                formData: true,
                // timeout: 10000,
            }),
            invalidatesTags: ['Products'],
        }),
        getAllProducts: builder.query({
            query: ({ page = 1, limit = 10, search = '', sort = 'newest', categories = '', brands = '', priceRange = null }) => {
                const params = { page, limit, search, sort };
                
                // Only add filter params if they have values
                if (categories) params.categories = categories;
                if (brands) params.brands = brands;
                if (priceRange) params.priceRange = priceRange;

                return {
                    url: '/products',
                    params
                };
            },
            providesTags: ['Products'],
            transformResponse: (response) => ({
                products: response.products,
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                totalCount: response.totalCount,
                hasMore: response.hasMore
            })
        }),
        updateProduct: builder.mutation({
            query: ({ productId, formData }) => ({
                url: `/products/${productId}/update`,
                method: 'PATCH',
                body: formData,
                formData: true,
                // timeout: 10000,
            }),
            invalidatesTags: ['Products','Cart'],
        }),
        toggleListProduct: builder.mutation({
            query: (productId) => ({
                url: `/products/${productId}/toggle-list`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Products'],
        }),
        getProductById: builder.query({
            query: (productId) => `/products/${productId}`,
            providesTags: ['Products'],
        }),
        // Order Management
        getAllOrders: builder.query({
            query: ({ page = 1, limit = 10, search = '' }) => ({
                url: '/orders',
                params: { page, limit, search }
            }),
            providesTags: ['Orders'],
            transformResponse: (response) => ({
                orders: response.orders,
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                totalOrders: response.totalOrders,
                hasNextPage: response.hasNextPage,
                hasPrevPage: response.hasPrevPage
            })
        }),
        updateOrderStatus: builder.mutation({
            query: ({ _id, status }) => ({
                url: `/orders/status`, // Adjust the endpoint if needed
                method: 'PATCH',
                body: { _id, status }
            }),
            invalidatesTags: ['Orders']
        }),
        cancelOrder: builder.mutation({
            query: (orderId) => ({
                url: `/orders/${orderId}/cancel`,
                method: 'PATCH'
            }),
            invalidatesTags: ['Orders']
        }),
        getOrderById: builder.query({
            query: (orderId) => `/orders/${orderId}`,
            providesTags: ['Orders']
        }),
        // Return Order Management
        getReturnRequests: builder.query({
            query: () => '/orders/returns',
            providesTags: ['Orders']
        }),
        handleReturnRequest: builder.mutation({
            query: ({ orderId, action }) => ({
                url: `/orders/${orderId}/return`,
                method: 'PATCH',
                body: { action }
            }),
            invalidatesTags: ['Orders']
        }),
        //Coupon Management
        getAllCoupons: builder.query({
            query: ({ page = 1, limit = 10, search = '' }) => ({
                url: '/coupons',
                params: { page, limit, search }
            }),
            providesTags: ['Coupons'],
            transformResponse: (response) => ({
                coupons: response.coupons,
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                totalCoupons: response.totalCoupons,
                hasNextPage: response.hasNextPage,
                hasPrevPage: response.hasPrevPage
            })
        }),
        createCoupon: builder.mutation({
            query: (couponData) => ({
                url: '/coupons/new',
                method: 'POST',
                body: couponData
            }),
            invalidatesTags: ['Coupons']
        }),
        deleteCoupon: builder.mutation({
            query: (couponId) => ({
                url: `/coupons/${couponId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Coupons']
        }),
        // Top selling items endpoints
        getTopSellingProducts: builder.query({
            query: () => ({
                url: '/sales-report/top-selling',
                params: { type: 'products' }
            })
        }),
        getTopSellingCategories: builder.query({
            query: () => ({
                url: '/sales-report/top-selling',
                params: { type: 'categories' }
            })
        }),
        getTopSellingBrands: builder.query({
            query: () => ({
                url: '/sales-report/top-selling',
                params: { type: 'brands' }
            })
        }),
        //Sales Reports
        getSalesReport: builder.query({
            query: ({ page = 1, limit = 10, search = '', filter, startDate, endDate }) => ({
                url: '/sales-report',
                method: 'POST',
                body: { filter, startDate, endDate },
                params: { page, limit, search }
            }),
            providesTags: ['Orders'],
            transformResponse: (response) => ({
                salesData: response.salesData,
                summary: response.summary,
                pagination: response.pagination
            })
        }),
        downloadSalesPDF: builder.mutation({
            query: ({filter, startDate, endDate} = {}) => ({
                url: '/sales-report/pdf',
                method: 'POST',
                body: { filter, startDate, endDate },
                responseHandler: (response) => response.blob()
            })
        }),
        downloadSalesExcel: builder.mutation({
            query: ({filter, startDate, endDate} = {}) => ({
                url: '/sales-report/excel',
                method: 'POST',
                body: { filter, startDate, endDate },
                responseHandler: (response) => response.blob()
            })
        }),
        // Banner Management
        getBanners: builder.query({
            query: () => '/banners',
            providesTags: ['Banners']
        }),
        updateBanners: builder.mutation({
            query: (formData) => ({
                url: '/banners/update',
                method: 'POST',
                body: formData,
                formData: true
            }),
            invalidatesTags: ['Banners']
        }),
    })
});

export const {
    useGetUsersQuery,
    useToggleBlockUserMutation,
    useCreateCategoryMutation,
    useGetAllCategoriesQuery,
    useUpdateCategoryMutation,
    useToggleListCategoryMutation,
    useGetCategoryByIdQuery,
    useCreateBrandMutation,
    useGetAllBrandsQuery,
    useUpdateBrandMutation,
    useToggleListBrandMutation,
    useGetBrandByIdQuery,
    useCreateProductMutation,
    useGetAllProductsQuery,
    useUpdateProductMutation,
    useToggleListProductMutation,
    useGetProductByIdQuery,
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
    useCancelOrderMutation,
    useGetOrderByIdQuery,
    useGetReturnRequestsQuery,
    useHandleReturnRequestMutation,
    useGetAllCouponsQuery,
    useCreateCouponMutation,
    useDeleteCouponMutation,
    useGetSalesReportQuery,
    useDownloadSalesExcelMutation,
    useDownloadSalesPDFMutation,
    useGetTopSellingProductsQuery,
    useGetTopSellingCategoriesQuery,
    useGetTopSellingBrandsQuery,
    useGetBannersQuery,
    useUpdateBannersMutation,
} = adminApi;