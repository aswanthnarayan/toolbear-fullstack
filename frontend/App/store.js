import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './features/rtkApis/authApi.js';
import authReducer from './features/slices/authSlice.js';
import themeReducer from './features/slices/themeSlice.js';
import checkoutReducer from './features/slices/checkoutSlice.js';
import wishlistReducer from './features/slices/wishlistSlice.js';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { adminApi } from './features/rtkApis/adminApi.js';
import { userApi } from './features/rtkApis/userApi.js';

const persistAuthConfig = {
  key: 'auth',
  storage,
  whitelist: ['user']
};

const persistThemeConfig = {
  key: 'theme',
  storage,
  whitelist: ['isDarkMode']
};

const persistWishlistConfig = {
  key: 'wishlist',
  storage,
  whitelist: ['items']
};

const persistedAuthReducer = persistReducer(persistAuthConfig, authReducer);
const persistedThemeReducer = persistReducer(persistThemeConfig, themeReducer);
const persistedWishlistReducer = persistReducer(persistWishlistConfig, wishlistReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    theme: persistedThemeReducer,
    checkout: checkoutReducer,
    wishlist: persistedWishlistReducer,

    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(authApi.middleware, adminApi.middleware, userApi.middleware),
});

export const persistor = persistStore(store);
