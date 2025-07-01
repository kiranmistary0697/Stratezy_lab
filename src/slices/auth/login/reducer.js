import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  user: null,
  isLoggedIn: false,
  roles: [],
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.roles = action.payload.roles;
      state.isLoggedIn = true;
    },
    logoutUserSuccess(state) {
      state.user = null;
      state.roles = [];
      state.isLoggedIn = false;
    },
  },
});

export const { loginSuccess, logoutUserSuccess } = loginSlice.actions;

export default loginSlice.reducer;
