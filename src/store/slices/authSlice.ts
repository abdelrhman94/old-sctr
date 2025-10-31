import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface User {
  email: string;
  userName: string;
  nationalId: string;
  firstNameEn: string;
  secondNameEn: string;
  familyNameEn: string;
  firstNameAr: string;
  secondNameAr: string;
  familyNameAr: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken: string }>
    ) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
      Cookies.set("roles", JSON.stringify(user.roles), { expires: 1, secure: true });
      Cookies.set("token", token, { expires: 1, secure: true });
      Cookies.set("refreshToken", refreshToken, { expires: 7, secure: true });
    },

    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      Cookies.remove("token");
      Cookies.remove("refreshToken");
    },

    loadUserFromStorage: (state) => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        state.user = JSON.parse(storedUser);
      }
    }
  }
});

export const { loginSuccess, logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
