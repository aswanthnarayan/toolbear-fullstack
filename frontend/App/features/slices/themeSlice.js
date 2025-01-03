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
          textGray: 'text-gray-300',
          textMuted: 'text-gray-400',
          border: 'border-gray-700',
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
          buttonHover: 'hover:bg-yellow-600',
          input: 'bg-transparent border-gray-600',
          label: 'text-white',
          iconButton: {
            text: 'text-gray-400',
            hover: 'hover:text-white hover:bg-gray-700',
            active: 'text-yellow-500',
            bg: 'hover:bg-gray-700 rounded-full p-1',
            disabled: 'text-gray-600 cursor-not-allowed'
          }
        },
        light: {
          primary: 'bg-neutral-300',
          secondary: 'bg-white bg-opacity-95',
          text: 'text-gray-800',
          textGray: 'text-gray-600',
          textMuted: 'text-gray-500',
          border: 'border-gray-200',
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
          buttonHover: 'hover:bg-yellow-600',
          input: 'bg-white border-gray-300',
          label: 'text-gray-700',
          iconButton: {
            text: 'text-gray-500',
            hover: 'hover:text-white hover:bg-yellow-500',
            active: 'text-yellow-600',
            bg: 'bg-yellow-500 text-white rounded-full p-1 hover:bg-yellow-600',
            disabled: 'text-gray-300 cursor-not-allowed'
          }
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