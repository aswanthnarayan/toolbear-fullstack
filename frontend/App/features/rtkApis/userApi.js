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
    tagTypes: ['Address'],
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
        })
    }),
});

export const {
    useGetAddressesQuery,
    useAddAddressMutation,
    useUpdateAddressMutation,
    useDeleteAddressMutation,
    useSetDefaultAddressMutation
} = userApi