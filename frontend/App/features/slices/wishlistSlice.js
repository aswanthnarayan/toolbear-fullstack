import { createSlice } from '@reduxjs/toolkit';
import { userApi } from '../rtkApis/userApi';
import { logout } from './authSlice';

const initialState = {
    items: [],
    loading: false,
    error: null
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        clearWishlist: (state) => {
            state.items = [];
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Reset state on logout
            .addCase(logout, (state) => {
                state.items = [];
                state.loading = false;
                state.error = null;
            })
            // When fetching wishlist
            .addMatcher(
                userApi.endpoints.getWishlist.matchPending,
                (state) => {
                    state.loading = true;
                }
            )
            .addMatcher(
                userApi.endpoints.getWishlist.matchFulfilled,
                (state, { payload }) => {
                    state.items = payload.wishlist?.products || [];
                    state.loading = false;
                    state.error = null;
                }
            )
            .addMatcher(
                userApi.endpoints.getWishlist.matchRejected,
                (state, { error }) => {
                    state.loading = false;
                    state.error = error.message;
                    state.items = [];
                }
            )
            // When adding to wishlist
            .addMatcher(
                userApi.endpoints.addToWishlist.matchFulfilled,
                (state, { payload }) => {
                    state.items = payload.wishlist?.products || [];
                }
            )
            // When removing from wishlist
            .addMatcher(
                userApi.endpoints.removeFromWishlist.matchFulfilled,
                (state, { payload }) => {
                    state.items = payload.wishlist?.products || [];
                }
            );
    }
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;