import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { logout } from "../slices/authSlice";

const baseQuery = fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/user` : '/api/user',
    credentials: 'include',
    prepareHeaders: (headers) => {
        if (headers.get('Content-Type')?.includes('multipart/form-data')) {
            headers.delete('Content-Type');
        }
        return headers;
    }
});

const baseQueryWithLogout = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 403) {
        // User is blocked or unauthorized, dispatch logout
        api.dispatch(logout());
    }
    return result;
};

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithLogout,
    tagTypes: ["Address", "Cart", "Order", "Profile", "Wishlist", "Coupons", "Wallet", "Products", "Categories", "Brands", "Reviews"],
    endpoints: (builder) => ({
        // Address endpoints
        getAddresses: builder.query({
            query: () => '/address',
            providesTags: ['Address']
        }),
        addAddress: builder.mutation({
            query: (data) => ({
                url: '/address',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Address']
        }),
        updateAddress: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/address/${id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Address']
        }),
        deleteAddress: builder.mutation({
            query: (id) => ({
                url: `/address/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Address']
        }),
        setDefaultAddress: builder.mutation({
            query: (id) => ({
                url: `/address/${id}`,
                method: 'PATCH'
            }),
            invalidatesTags: ['Address']
        }),
         // Cart endpoints
    getCart: builder.query({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (data) => ({
        url: "/cart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/cart/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartQuantity: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `/cart/${productId}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

  //  Order endpoints
  getAllOrders: builder.query({
    query: ({ page = 1, limit = 5 } = {}) => `/order/all?page=${page}&limit=${limit}`,
    providesTags: ["Order"],
  }),
  createOrder: builder.mutation({
    query: (data) => ({
      url: "/order",
      method: "POST",
      body: data,
    }),
    invalidatesTags: ["Order", "Cart", "Products"],
  }),
  completePayment: builder.mutation({
    query: (data) => ({
      url: "/order/complete-payment",
      method: "POST",
      body: data,
    }),
    invalidatesTags: ["Order", "Cart", "Products", "Wallet"],
  }),

  getOrderById: builder.query({
    query: (id) => ({
      url: `/order/${id}`,
      method: 'GET'
    }),
    providesTags: ["Order"]
  }),
  cancelOrder: builder.mutation({
    query: (id) => ({
      url: `/order/${id}`,
      method: "PATCH",
    }),
    invalidatesTags: ["Order"],
  }),
  returnOrder: builder.mutation({
    query: ({ orderId, reason }) => ({
      url: `/orders/${orderId}/return`,
      method: 'POST',
      body: { reason }
    }),
    invalidatesTags: ['Order']
  }),
  //profile
  getUser:builder.query({
    query:(data)=>({
      url:"/profile",
      method:"GET",
      providesTags:["Profile"]
    })
  }),
  updateProfile:builder.mutation({
    query:(data)=>({
      url:"/profile/edit",
      method:"PATCH",
      body:data
    }),
    invalidatesTags:["Profile"]
  }),
  // Razorpay endpoint
  createRazorpayOrder: builder.mutation({
    query: (data) => ({
      url: '/orders/create-razorpay',
      method: 'POST',
      body: data
    })
  }),
  // Wishlist endpoints
  getWishlist: builder.query({
    query: () => "/wishlist",
    providesTags: ["Wishlist"],
  }),
  addToWishlist: builder.mutation({
    query: (data) => ({
      url: "/wishlist",
      method: "POST",
      body: data,
    }),
    invalidatesTags: ["Wishlist"],
  }),
  removeFromWishlist: builder.mutation({
    query: (productId) => ({
      url: `/wishlist/${productId}`,
      method: "DELETE",
    }),
    invalidatesTags: ["Wishlist"],
  }),
  // Coupon endpoints
  getAvailableCoupons: builder.query({
    query: ({ page = 1, limit = 5 }) => `/coupons?page=${page}&limit=${limit}`,
    providesTags: ['Coupons']
  }),
  validateCoupon: builder.query({
    query: (code) => `/coupons/${code}`,
    providesTags: ['Coupons']
  }),
  // Wallet endpoints
  getWallet: builder.query({
    query: ({ page = 1, limit = 10 }) => `/wallet?page=${page}&limit=${limit}`,
    providesTags: ['Wallet']
  }),
  processRefund: builder.mutation({
    query: ({ orderId, amount }) => ({
      url: '/wallet/refund',
      method: 'POST',
      body: { orderId, amount }
    }),
    invalidatesTags: ['Wallet', 'Order']
  }),
  getProductByCategory: builder.query({
    query: (categoryId) => `/products/category/${categoryId}`,
    providesTags: ['Products']
  }),
  //
  getAllCategoriesOfBrand: builder.query({
    query: (brandId) => `/products/brand/${brandId}/categories`,
    providesTags: ['Products']
  }),
  downloadInvoice: builder.mutation({
    query: (orderId) => ({
      url: `/orders/${orderId}/invoice`,
      method: 'GET',
      responseHandler: (response) => response.blob()
    }),
    invalidatesTags: ['Order']
  }),
  // Top Selling Items
  getTopSellingItems: builder.query({
    query: () => ({
      url: '/top-selling-items',
      method: 'GET'
    }),
    providesTags: ['Products', 'Categories', 'Brands']
  }),
  // Review endpoints
  getAllReviews: builder.query({
    query: ({ productId, page = 1, limit = 10 } = {}) => `/reviews?productId=${productId}&page=${page}&limit=${limit}`,
    providesTags: ['Reviews']
  }),
  checkUserPurchase: builder.query({
    query: (productId) => `/reviews/check-purchase/${productId}`,
    providesTags: (result, error, productId) => [{ type: 'Reviews', id: productId }]
  }),
  addReview: builder.mutation({
    query: (data) => ({
      url: '/reviews/add',
      method: 'POST',
      body: data
    }),
    invalidatesTags: (result, error, { productId }) => [
      { type: 'Reviews', id: productId },
      'Reviews',
      'Products'
    ]
  }),
  deleteReview: builder.mutation({
    query: (reviewId) => ({
      url: `/reviews/${reviewId}`,
      method: 'DELETE'
    }),
    invalidatesTags: ['Reviews', 'Products']
  }),
  updateReview: builder.mutation({
    query: ({ reviewId, ...data }) => ({
      url: `/reviews/${reviewId}`,
      method: 'PUT',
      body: data
    }),
    invalidatesTags: ['Reviews', 'Products']
  }),
}),
});

export const {
    useGetAddressesQuery,
    useAddAddressMutation,
    useUpdateAddressMutation,
    useDeleteAddressMutation,
    useSetDefaultAddressMutation,
    useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartQuantityMutation,
  useGetAllOrdersQuery,
  useCreateOrderMutation,
  useCompletePaymentMutation,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useReturnOrderMutation,
  useGetUserQuery,
  useUpdateProfileMutation,
  useCreateRazorpayOrderMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetAvailableCouponsQuery,
  useValidateCouponQuery,
  useGetWalletQuery,
  useProcessRefundMutation,
  useGetProductByCategoryQuery,
  useGetAllCategoriesOfBrandQuery,
  useDownloadInvoiceMutation,
  useGetTopSellingItemsQuery,
  useGetAllReviewsQuery,
  useCheckUserPurchaseQuery,
  useAddReviewMutation,
  useDeleteReviewMutation,
  useUpdateReviewMutation
} = userApi