import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  account: JSON.parse(localStorage.getItem('account')) || null
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload;
      localStorage.setItem('account', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.account = null;
      localStorage.removeItem('account');
    }
  }
});

export const { setAccount, logout } = accountSlice.actions;
export default accountSlice.reducer;
