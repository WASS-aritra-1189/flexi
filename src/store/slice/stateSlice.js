import { createSlice } from "@reduxjs/toolkit";
import { setUploading, setLoading } from "./loaderSlice";
import { services } from "../../shared/_services/api_services";
import {
  errorHandler,
  successHandler,
} from "../../shared/_helper/response_helper";

const initialState = {
  states: [],
  state: null,
  totalCount: 0,
};

const stateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    setStates: (state, { payload }) => {
      state.states = payload.result;
      state.totalCount = payload.total;
    },
    setState: (state, { payload }) => {
      state.state = payload;
    },
  },
});

export const { setStates, setState } = stateSlice.actions;

export default stateSlice.reducer;

export function getStates(payload) {
  return async function getStatesThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getAllState(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setStates(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function createState(payload) {
  return async function createStateThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.createState(payload.body).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getStates(payload.filters));
          successHandler("State created successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function updateStateData(payload) {
  return async function updateStateThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateState(payload.id, payload.body).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getStates(payload.filters));
          successHandler("State updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function updateStateStatus(payload) {
  return async function updateStateStatusThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.changeStateStatus(payload.id, payload.body).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getStates(payload.filters));
          successHandler("State status updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}
