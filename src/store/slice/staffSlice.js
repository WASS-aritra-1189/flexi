import { createSlice } from "@reduxjs/toolkit";
import { setUploading, setLoading } from "./loaderSlice";
import { services } from "../../shared/_services/api_services";
import { errorHandler, successHandler } from "../../shared/_helper/response_helper";

const initialState = {
  staffList: [],
  staffListCount: 0,
  selectedStaff: null,
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    setStaffList: (state, action) => {
      state.staffList = action.payload.result;
      state.staffListCount = action.payload.total;
    },
    setSelectedStaff: (state, action) => {
      state.selectedStaff = action.payload;
    },
  },
});

export const { setStaffList, setSelectedStaff } = staffSlice.actions;
export default staffSlice.reducer;

export function fetchStaffList(payload) {
  return async function (dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getStaffList(payload).then(
        (response) => { dispatch(setLoading(false)); dispatch(setStaffList(response.data)); },
        (error) => { dispatch(setLoading(false)); errorHandler(error.response); },
      );
    } catch (err) {}
  };
}

export function fetchStaffById(id) {
  return async function (dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getStaffById(id).then(
        (response) => { dispatch(setLoading(false)); dispatch(setSelectedStaff(response.data)); },
        (error) => { dispatch(setLoading(false)); errorHandler(error.response); },
      );
    } catch (err) {}
  };
}

export function createStaff(payload, filters) {
  return async function (dispatch) {
    dispatch(setUploading(true));
    try {
      await services.addStaff(payload).then(
        () => { dispatch(setUploading(false)); dispatch(fetchStaffList(filters)); successHandler("Staff added successfully!"); },
        (error) => { dispatch(setUploading(false)); errorHandler(error.response); },
      );
    } catch (err) {}
  };
}

export function editStaff(id, payload, filters) {
  return async function (dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateStaff(id, payload).then(
        () => { dispatch(setUploading(false)); dispatch(fetchStaffList(filters)); successHandler("Staff updated successfully!"); },
        (error) => { dispatch(setUploading(false)); errorHandler(error.response); },
      );
    } catch (err) {}
  };
}

export function changeStaffPassword(id, payload, onSuccess) {
  return async function (dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateStaffPassword(id, payload).then(
        () => { dispatch(setUploading(false)); successHandler("Password updated successfully!"); if (onSuccess) onSuccess(); },
        (error) => { dispatch(setUploading(false)); errorHandler(error.response); },
      );
    } catch (err) {}
  };
}

export function changeStaffStatus(id, payload, filters) {
  return async function (dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateStaffStatus(id, payload).then(
        () => { dispatch(setUploading(false)); dispatch(fetchStaffList(filters)); successHandler("Status updated successfully!"); },
        (error) => { dispatch(setUploading(false)); errorHandler(error.response); },
      );
    } catch (err) {}
  };
}

export function removeStaff(id, filters) {
  return async function (dispatch) {
    dispatch(setUploading(true));
    try {
      await services.deleteStaff(id).then(
        () => { dispatch(setUploading(false)); dispatch(fetchStaffList(filters)); successHandler("Staff deleted successfully!"); },
        (error) => { dispatch(setUploading(false)); errorHandler(error.response); },
      );
    } catch (err) {}
  };
}
