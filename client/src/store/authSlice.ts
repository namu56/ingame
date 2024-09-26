import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    storeLogin: (state, action: PayloadAction<{ token: string }>) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
    },
    storeLogout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { storeLogin, storeLogout } = authSlice.actions;

export default authSlice.reducer;

export const isLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const accessToken = (state: RootState) => state.auth.token;
