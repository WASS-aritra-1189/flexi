import { createSlice } from "@reduxjs/toolkit";
import { setUploading } from "./loaderSlice";
import { services } from "../../shared/_services/api_services";
import {
  errorHandler,
  successHandler,
} from "../../shared/_helper/response_helper";

const initialState = {};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("token", action.payload.token);
      successHandler("LoggedIn successfully!");
    },
    logout: (state) => {
      localStorage.clear();
      successHandler("Logged out successfully");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;

export function loginUser(credentials, navigate) {
  return async function loginUserThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.login(credentials).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(loginSuccess(response.data));
          navigate("/dashboard");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}
