import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/admin' }),
    tagTypes: ['Users'],
    endpoints: (builder) => ({
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
        })
    })
});

export const {
    useGetUsersQuery,
    useToggleBlockUserMutation
} = adminApi;