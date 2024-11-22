// slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../rtkApis/authApi.js';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.signIn.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
        }
      )
      .addMatcher(
        authApi.endpoints.completeGoogleSignup.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
        }
      )
      .addMatcher(
        authApi.endpoints.signUpGoogle.matchFulfilled,
        (state, { payload }) => {
          // Only update state if user exists in payload (for existing verified users)
          if (payload.user) {
            state.user = payload.user;
          }
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
