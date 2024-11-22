
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './features/rtkApis/authApi.js';
import authReducer from './features/slices/authSlice.js';
import themeReducer from './features/slices/themeSlice.js';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { adminApi } from './features/rtkApis/adminApi.js';

const persistAuthConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token'],
};
const persistThemeConfig = {  // Theme
  key: 'theme',
  storage,
  whitelist: ['isDarkMode'],
};

const persistedAuthReducer = persistReducer(persistAuthConfig, authReducer);
const persistedThemeReducer = persistReducer(persistThemeConfig, themeReducer);
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    theme: persistedThemeReducer,
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(authApi.middleware, adminApi.middleware),
});

export const persistor = persistStore(store);
