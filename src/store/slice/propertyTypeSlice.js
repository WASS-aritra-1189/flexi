import { createSlice } from "@reduxjs/toolkit";
import { setUploading, setLoading } from "./loaderSlice";
import { services } from "../../shared/_services/api_services";
import {
  errorHandler,
  successHandler,
} from "../../shared/_helper/response_helper";

const initialState = {
  propertyTypes: [],
  propertyType: null,
  totalCount: 0,
};

const propertyTypeSlice = createSlice({
  name: "propertyType",
  initialState,
  reducers: {
    setPropertyTypes: (state, { payload }) => {
      state.propertyTypes = payload.result;
      state.totalCount = payload.total;
    },
    setPropertyType: (state, { payload }) => {
      state.propertyType = payload;
    },
  },
});

export const { setPropertyTypes, setPropertyType } = propertyTypeSlice.actions;

export default propertyTypeSlice.reducer;

export function getPropertyTypes(payload) {
  return async function getPropertyTypesThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getAllPropertyType(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setPropertyTypes(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function createPropertyType(payload) {
  const { body, filters } = payload;
  return async function createPropertyTypeThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.createPropertyType(body).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getPropertyTypes(filters));
          successHandler("Property Type created successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function updatePropertyTypeData(payload) {
  const { id, filters, body } = payload;
  return async function updatePropertyTypeThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updatePropertyType(id, body).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getPropertyTypes(filters));
          successHandler("Property Type updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function deletePropertyTypeData(payload) {
  const { id, filters } = payload;
  return async function deletePropertyTypeThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.deletePropertyType(id).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getPropertyTypes(filters));
          successHandler("Property Type deleted successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}
