import { createSlice } from "@reduxjs/toolkit";
import { setUploading, setLoading } from "./loaderSlice";
import { services } from "../../shared/_services/api_services";
import {
  errorHandler,
  successHandler,
} from "../../shared/_helper/response_helper";

const initialState = {
  vendorList: [],
  vendorListCount: 0,
  selectedVendor: null,
  userList: [],
  userListCount: 0,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setVendorList: (state, action) => {
      state.vendorList = action.payload.result;
      state.vendorListCount = action.payload.total;
    },
    setSelectedVendor: (state, action) => {
      state.selectedVendor = action.payload;
    },
    setUserList: (state, action) => {
      state.userList = action.payload.result;
      state.userListCount = action.payload.total;
    },
  },
});

export const { setVendorList, setSelectedVendor, setUserList } = accountSlice.actions;

export default accountSlice.reducer;

export function fetchVendorList(payload) {
  return async function fetchVendorListThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.vendorList(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setVendorList(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function changeVendorStatus(body, filters) {
  return async function changeVendorStatusThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.changeVendorStatus(body).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(fetchVendorList(filters));
          successHandler("Status Updated Successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function fetchVendorDetail(id) {
  return async function fetchVendorDetailThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getVendorDetail(id).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setSelectedVendor(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function fetchUserList(payload) {
  return async function fetchUserListThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.userList(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setUserList(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

// export function changeUserStatus(body, filters) {
//   return async function changeUserStatusThunk(dispatch) {
//     dispatch(setUploading(true));
//     try {
//       await services.changeVendorStatus(body).then(
//         (response) => {
//           dispatch(setUploading(false));
//           dispatch(fetchUserList(filters));
//           successHandler("Status Updated Successfully!");
//         },
//         (error) => {
//           dispatch(setUploading(false));
//           errorHandler(error.response);
//         },
//       );
//     } catch (err) {}
//   };
// }

// Commented out until backend API is ready
// export function fetchVendorById(id) {
//   return async function fetchVendorByIdThunk(dispatch) {
//     dispatch(setLoading(true));
//     try {
//       await services.getVendorById(id).then(
//         (response) => {
//           dispatch(setLoading(false));
//           dispatch(setSelectedVendor(response.data));
//         },
//         (error) => {
//           dispatch(setLoading(false));
//           errorHandler(error.response);
//         },
//       );
//     } catch (err) {}
//   };
// }
