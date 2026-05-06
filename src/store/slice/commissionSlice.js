import { createSlice } from "@reduxjs/toolkit";
import { setUploading, setLoading } from "./loaderSlice";
import { services } from "../../shared/_services/api_services";
import {
  errorHandler,
  successHandler,
} from "../../shared/_helper/response_helper";

const initialState = {
  commissions: [],
  totalCount: 0,
};

const commissionSlice = createSlice({
  name: "commission",
  initialState,
  reducers: {
    setCommissions: (state, { payload }) => {
      state.commissions = payload.result;
      state.totalCount = payload.total;
    },
  },
});

export const { setCommissions } = commissionSlice.actions;

export default commissionSlice.reducer;

export function getCommissions(payload) {
  return async function getCommissionsThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getAllCommission(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setCommissions(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function createCommissionData(payload) {
  return async function createCommissionThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.createCommission(payload.body).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getCommissions(payload.filters));
          successHandler("Commission created successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function updateCommissionData(payload) {
  return async function updateCommissionThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateCommission(payload.id, payload.body).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getCommissions(payload.filters));
          successHandler("Commission updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function deleteCommissionData(payload) {
  return async function deleteCommissionThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.deleteCommission(payload.id).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getCommissions(payload.filters));
          successHandler("Commission deleted successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}
