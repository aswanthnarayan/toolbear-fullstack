import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: '/api/admin',
        prepareHeaders: (headers) => {
            // Remove Content-Type header for FormData
            // Let the browser set it automatically with the correct boundary
            if (headers.get('Content-Type')?.includes('multipart/form-data')) {
                headers.delete('Content-Type');
            }
            return headers;
        }
    }),
    tagTypes: ['Users', 'Categories', 'Brands', 'Products'],
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
                // Don't set Content-Type header, let browser handle it
                formData: true,
                // Increase timeout for large uploads
                timeout: 10000,
            }),
            invalidatesTags: ['Categories'],
        }),
        getAllCategories: builder.query({
            query: ({ page = 1, limit = 10, search = '' }) => ({
                url: '/categories',
                params: { page, limit, search }
            }),
            providesTags: ['Categories'],
            transformResponse: (response) => ({
                categories: response.categories,
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                totalCategories: response.total,
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
                timeout: 10000,
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
                timeout: 10000,
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
                timeout: 10000,
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
                timeout: 10000,
            }),
            invalidatesTags: ['Products'],
        }),
        getAllProducts: builder.query({
            query: ({ page = 1, limit = 10, search = '' }) => ({
                url: '/products',
                params: { page, limit, search }
            }),
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
                timeout: 10000,
            }),
            invalidatesTags: ['Products'],
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
} = adminApi;