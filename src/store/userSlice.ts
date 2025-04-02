import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  isLoggedIn: false,
  userDetails: {}
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, { payload }) {

      // check if the user is authenticated
      if (payload.status) {
        state.isLoggedIn = true;
      } else {
        state.isLoggedIn = false;
      }
    },
    logout(state, { payload }) {
      if (payload.status) {
        state.isLoggedIn = false;
        state.userDetails = {};
      } else {
        state.isLoggedIn = true;
      }
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
