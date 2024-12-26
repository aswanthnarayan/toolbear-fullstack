import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { getAllCategoriesOfBrand } from "../../../../backend/controllers/Users/FilterdQuieriesController";


export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: '/api/user',
        credentials: 'include',
        prepareHeaders: (headers) => {
            if (headers.get('Content-Type')?.includes('multipart/form-data')) {
                headers.delete('Content-Type');
            }
            return headers;
        }
    }),
    tagTypes: ["Address", "Cart", "Order", "Profile", "Wishlist", "Coupons", "Wallet"],
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
    query: () => "/order/all",
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
    invalidatesTags: ["Order", "Cart", "Products"],
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
    query: () => '/coupons',
    providesTags: ['Coupons']
  }),
  validateCoupon: builder.query({
    query: (code) => `/coupons/${code}`,
    providesTags: ['Coupons']
  }),
  // Wallet endpoints
  getWallet: builder.query({
    query: () => '/wallet',
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
  useDownloadInvoiceMutation
} = userApi