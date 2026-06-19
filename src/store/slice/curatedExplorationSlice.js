import { createSlice } from "@reduxjs/toolkit";
import { setUploading, setLoading } from "./loaderSlice";
import { services } from "../../shared/_services/api_services";
import { errorHandler, successHandler } from "../../shared/_helper/response_helper";

const initialState = {
  curatedExplorations: [],
  totalCount: 0,
};

const curatedExplorationSlice = createSlice({
  name: "curatedExploration",
  initialState,
  reducers: {
    setCuratedExplorations: (state, { payload }) => {
      state.curatedExplorations = payload.result;
      state.totalCount = payload.total;
    },
  },
});

export const { setCuratedExplorations } = curatedExplorationSlice.actions;
export default curatedExplorationSlice.reducer;

export function getCuratedExplorations(payload) {
  return async function (dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getAllCuratedExplorations(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setCuratedExplorations(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        }
      );
    } catch (err) {}
  };
}

export function createCuratedExploration(payload) {
  const { formData, filters } = payload;
  return async function (dispatch) {
    dispatch(setUploading(true));
    try {
      await services.createCuratedExploration(formData).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getCuratedExplorations(filters));
          successHandler("Curated Exploration created successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        }
      );
    } catch (err) {}
  };
}

export function updateCuratedExplorationData(payload) {
  const { id, formData, filters } = payload;
  return async function (dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateCuratedExploration(id, formData).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getCuratedExplorations(filters));
          successHandler("Curated Exploration updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        }
      );
    } catch (err) {}
  };
}

export function deleteCuratedExplorationData(payload) {
  const { id, filters } = payload;
  return async function (dispatch) {
    dispatch(setUploading(true));
    try {
      await services.deleteCuratedExploration(id).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getCuratedExplorations(filters));
          successHandler("Curated Exploration deleted successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        }
      );
    } catch (err) {}
  };
}
