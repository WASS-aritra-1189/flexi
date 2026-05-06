import { createSlice } from "@reduxjs/toolkit";
import { setUploading, setLoading } from "./loaderSlice";
import { services } from "../../shared/_services/api_services";
import {
  errorHandler,
  successHandler,
} from "../../shared/_helper/response_helper";

const initialState = {
  languages: [],
  totalCount: 0,
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguages: (state, { payload }) => {
      state.languages = payload.result;
      state.totalCount = payload.total;
    },
  },
});

export const { setLanguages } = languageSlice.actions;

export default languageSlice.reducer;

export function getLanguages(payload) {
  return async function getLanguagesThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getAllLanguage(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setLanguages(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function createLanguageData(payload) {
  return async function createLanguageThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.createLanguage(payload.body).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getLanguages(payload.filters));
          successHandler("Language created successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function updateLanguageData(payload) {
  return async function updateLanguageThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateLanguage(payload.id, payload.body).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getLanguages(payload.filters));
          successHandler("Language updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function deleteLanguageData(payload) {
  return async function deleteLanguageThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.deleteLanguage(payload.id).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getLanguages(payload.filters));
          successHandler("Language deleted successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}
