import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  error: "",
  success: "",
  user: {},
};

const ProfileSlice = createSlice({
  name: "Profile",
  initialState,
  reducers: {
    profileSuccess(state, action) {
      state.success = action.payload.status;
      state.user = action.payload.data;
    },
    profileError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { profileSuccess, profileError } = ProfileSlice.actions;

export default ProfileSlice.reducer;
