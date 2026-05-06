import { createSlice } from "@reduxjs/toolkit";
import { setUploading, setLoading } from "./loaderSlice";
import { services } from "../../shared/_services/api_services";
import {
  errorHandler,
  successHandler,
} from "../../shared/_helper/response_helper";

const initialState = {
  currencies: [],
  totalCount: 0,
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrencies: (state, { payload }) => {
      state.currencies = payload.result;
      state.totalCount = payload.total;
    },
  },
});

export const { setCurrencies } = currencySlice.actions;

export default currencySlice.reducer;

export function getCurrencies(payload) {
  return async function getCurrenciesThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getAllCurrency(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setCurrencies(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function createCurrencyData(payload) {
  return async function createCurrencyThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.createCurrency(payload.body).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getCurrencies(payload.filters));
          successHandler("Currency created successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function updateCurrencyData(payload) {
  return async function updateCurrencyThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateCurrency(payload.id, payload.body).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getCurrencies(payload.filters));
          successHandler("Currency updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function deleteCurrencyData(payload) {
  return async function deleteCurrencyThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.deleteCurrency(payload.id).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getCurrencies(payload.filters));
          successHandler("Currency deleted successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}
