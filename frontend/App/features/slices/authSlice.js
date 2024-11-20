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
    builder.addMatcher(
      authApi.endpoints.signIn.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user;
        state.token = payload.token;
      }
    );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
