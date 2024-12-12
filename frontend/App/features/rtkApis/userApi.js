import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

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
    tagTypes: ["Address", "Cart", "Order , Profile"],
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
    invalidatesTags: ["Order", "Cart"],
  }),
  getOrderById: builder.query({
    query: (id) => `/order/${id}`,
    providesTags: ["Order"],
  }),
  cancelOrder: builder.mutation({
    query: (id) => ({
      url: `/order/${id}`,
      method: "PATCH",
    }),
    invalidatesTags: ["Order"],
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
  })
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
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useGetUserQuery,
  useUpdateProfileMutation,
} = userApi