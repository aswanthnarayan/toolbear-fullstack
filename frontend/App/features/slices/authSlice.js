// slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../rtkApis/authApi.js';

const extractMinimalUserData = (user) => ({
  // _id: user._id,
  role: user.role,
  isVerified: user.isVerified,
  isBlocked: user.isBlocked,
  provider: user.provider 
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      // Clear any stored auth data
      localStorage.removeItem('user');
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.signIn.matchFulfilled,
        (state, { payload }) => {
          if (payload?.user) {
            state.user = extractMinimalUserData(payload.user);
          }
        }
      )
      .addMatcher(
        authApi.endpoints.completeGoogleSignup.matchFulfilled,
        (state, { payload }) => {
          if (payload?.user) {
            state.user = extractMinimalUserData(payload.user);
          }
        }
      )
      .addMatcher(
        authApi.endpoints.signUpGoogle.matchFulfilled,
        (state, { payload }) => {
          if (payload?.user) {
            state.user = extractMinimalUserData(payload.user);
          }
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;