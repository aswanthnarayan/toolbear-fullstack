import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedAddress: null,
  checkoutAmount: 0,
  paymentMethod: null
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCheckoutData: (state, action) => {
      const { selectedAddress, checkoutAmount } = action.payload;
      state.selectedAddress = selectedAddress;
      state.checkoutAmount = checkoutAmount;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    clearCheckoutData: (state) => {
      state.selectedAddress = null;
      state.checkoutAmount = 0;
      state.paymentMethod = null;
    }
  }
});

export const { setCheckoutData, setPaymentMethod, clearCheckoutData } = checkoutSlice.actions;
export default checkoutSlice.reducer;