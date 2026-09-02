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
  vendorProperties: [],
  vendorPropertiesCount: 0,
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
    setVendorProperties: (state, action) => {
      state.vendorProperties = action.payload.result;
      state.vendorPropertiesCount = action.payload.total;
    },
    updatePropertyInList: (state, action) => {
      const updated = action.payload;
      state.vendorProperties = state.vendorProperties.map((p) =>
        p.id === updated.id ? { ...p, ...updated } : p
      );
    },
  },
});

export const { setVendorList, setSelectedVendor, setUserList, setVendorProperties, updatePropertyInList } = accountSlice.actions;

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

export function updateVendorDetails(accountId, payload) {
  return async function updateVendorDetailsThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateVendorDetails(accountId, payload).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(fetchVendorDetail(accountId));
          successHandler('Vendor details updated successfully!');
        },
        (error) => {
          dispatch(setUploading(false));
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

export function fetchVendorProperties(vendorId, payload) {
  return async function fetchVendorPropertiesThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getVendorProperties(vendorId, payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setVendorProperties(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function changePropertyStatus(id, payload, vendorId, filters) {
  return async function (dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updatePropertyStatus(id, payload).then(
        () => {
          dispatch(setUploading(false));
          dispatch(fetchVendorProperties(vendorId, filters));
          successHandler("Property status updated successfully!");
        },
        (error) => { dispatch(setUploading(false)); errorHandler(error.response); },
      );
    } catch (err) {}
  };
}

export function editProperty(id, payload, vendorId, filters) {
  return async function (dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateProperty(id, payload).then(
        () => {
          dispatch(setUploading(false));
          dispatch(fetchVendorProperties(vendorId, filters));
          successHandler("Property updated successfully!");
        },
        (error) => { dispatch(setUploading(false)); errorHandler(error.response); },
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
