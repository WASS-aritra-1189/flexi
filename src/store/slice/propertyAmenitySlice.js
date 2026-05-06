import { createSlice } from "@reduxjs/toolkit";
import { setUploading, setLoading } from "./loaderSlice";
import { services } from "../../shared/_services/api_services";
import {
  errorHandler,
  successHandler,
} from "../../shared/_helper/response_helper";

const initialState = {
  propertyAmenities: [],
  propertyAmenity: null,
  totalCount: 0,
};

const propertyAmenitySlice = createSlice({
  name: "propertyAmenity",
  initialState,
  reducers: {
    setPropertyAmenities: (state, { payload }) => {
      state.propertyAmenities = payload.result;
      state.totalCount = payload.total;
    },
    setPropertyAmenity: (state, { payload }) => {
      state.propertyAmenity = payload;
    },
  },
});

export const { setPropertyAmenities, setPropertyAmenity } = propertyAmenitySlice.actions;

export default propertyAmenitySlice.reducer;

export function getPropertyAmenities(payload) {
  return async function getPropertyAmenitiesThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getAllPropertyAmenity(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setPropertyAmenities(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function createPropertyAmenity(payload) {
  const { body, filters } = payload;
  return async function createPropertyAmenityThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.createPropertyAmenity(body).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getPropertyAmenities(filters));
          successHandler("Property Amenity created successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function updatePropertyAmenityData(payload) {
  const { id, filters, body } = payload;
  return async function updatePropertyAmenityThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updatePropertyAmenity(id, body).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getPropertyAmenities(filters));
          successHandler("Property Amenity updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function deletePropertyAmenityData(payload) {
  const { id, filters } = payload;
  return async function deletePropertyAmenityThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.deletePropertyAmenity(id).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getPropertyAmenities(filters));
          successHandler("Property Amenity deleted successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}
