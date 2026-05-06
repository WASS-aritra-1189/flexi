import { createSlice } from "@reduxjs/toolkit";
import { setUploading, setLoading } from "./loaderSlice";
import { services } from "../../shared/_services/api_services";
import {
  errorHandler,
  successHandler,
} from "../../shared/_helper/response_helper";

const initialState = {
  cities: [],
  city: null,
  totalCount: 0,
};

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    setCities: (state, { payload }) => {
      state.cities = payload.result;
      state.totalCount = payload.count;
    },
    setCity: (state, { payload }) => {
      state.city = payload;
    },
  },
});

export const { setCities, setCity } = citySlice.actions;

export default citySlice.reducer;

export function getCities(payload) {
  return async function getCitiesThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getAllCity(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setCities(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function createCity(payload) {
  return async function createCityThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.createCity(payload.body).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getCities(payload.filters));
          successHandler("City created successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function updateCityData(payload) {
  return async function updateCityThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateCity(payload.id, payload.body).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getCities(payload.filters));
          successHandler("City updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function updateCityStatus(payload) {
  return async function updateCityStatusThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.changeCityStatus(payload.id, payload.body).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getCities(payload.filters));
          successHandler("City status updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}
