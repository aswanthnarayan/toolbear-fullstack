// themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
      isDarkMode: false,
      theme: {
        dark: {
          primary: 'bg-gray-900',
          secondary: 'bg-gray-800',
          text: 'text-white',
          search: {
            bg: 'bg-gray-700',
            focusBg: 'bg-gray-600',
            text: 'text-white',
            ring: 'ring-yellow-500'
          },
          hover: 'hover:bg-gray-700',
          accent: 'text-yellow-500',
          accentHover: 'hover:text-yellow-600',
          button: 'bg-yellow-500',
          buttonHover: 'hover:bg-yellow-600'
        },
        light: {
          primary: 'bg-white',
          secondary: 'bg-white bg-opacity-95',
          text: 'text-gray-800',
          search: {
            bg: 'bg-gray-50',
            focusBg: 'bg-gray-100',
            text: 'text-gray-900',
            ring: 'ring-yellow-500'
          },
          hover: 'hover:bg-gray-50',
          accent: 'text-yellow-600',
          accentHover: 'hover:text-yellow-700',
          button: 'bg-yellow-500',
          buttonHover: 'hover:bg-yellow-600'
        }
      }
    },
    reducers: {
      toggleTheme: (state) => {
        state.isDarkMode = !state.isDarkMode;
      },
      setTheme: (state, action) => {
        state.isDarkMode = action.payload;
      }
    }
  });

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;