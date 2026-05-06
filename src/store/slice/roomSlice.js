import { createSlice } from "@reduxjs/toolkit";
import { setUploading, setLoading } from "./loaderSlice";
import { services } from "../../shared/_services/api_services";
import {
  errorHandler,
  successHandler,
} from "../../shared/_helper/response_helper";

const initialState = {
  roomTypes: [],
  roomTypeTotalCount: 0,
  roomAmenities: [],
  roomAmenity: null,
  roomAmenityTotalCount: 0,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoomTypes: (state, { payload }) => {
      state.roomTypes = payload.result;
      state.roomTypeTotalCount = payload.total;
    },
    setRoomAmenities: (state, { payload }) => {
      state.roomAmenities = payload.result;
      state.roomAmenityTotalCount = payload.total;
    },
  },
});

export const { setRoomTypes, setRoomAmenities } = roomSlice.actions;

export default roomSlice.reducer;

// Room Type Functions
export function getRoomTypes(payload) {
  return async function getRoomTypesThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getAllRoomType(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setRoomTypes(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function createRoomType(payload) {
  const { body, filters } = payload;
  return async function createRoomTypeThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.createRoomType(body).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getRoomTypes(filters));
          successHandler("Room Type created successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function updateRoomTypeData(payload) {
  const { id, filters, body, iconFile } = payload;
  return async function updateRoomTypeThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateRoomType(id, body).then(
        (response) => {
          dispatch(setUploading(false));
          if (iconFile) {
            const fd = new FormData();
            fd.append('file', iconFile);
            dispatch(uploadRoomTypeIcon({ id, formData: fd, filters }));
          } else {
            dispatch(getRoomTypes(filters));
          }
          successHandler("Room Type updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function uploadRoomTypeIcon(payload) {
  const { id, formData, filters } = payload;
  return async function uploadRoomTypeIconThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateRoomTypeIcon(id, formData).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getRoomTypes(filters));
          successHandler("Room Type icon updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function deleteRoomTypeData(payload) {
  const { id, filters } = payload;
  return async function deleteRoomTypeThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.deleteRoomType(id).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getRoomTypes(filters));
          successHandler("Room Type deleted successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

// Room Amenity Functions
export function getRoomAmenities(payload) {
  return async function getRoomAmenitiesThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getAllRoomAmenity(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setRoomAmenities(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function createRoomAmenity(payload) {
  const { body, filters } = payload;
  return async function createRoomAmenityThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.createRoomAmenity(body).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getRoomAmenities(filters));
          successHandler("Room Amenity created successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function updateRoomAmenityData(payload) {
  const { id, filters, body } = payload;
  return async function updateRoomAmenityThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateRoomAmenity(id, body).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getRoomAmenities(filters));
          successHandler("Room Amenity updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function deleteRoomAmenityData(payload) {
  const { id, filters } = payload;
  return async function deleteRoomAmenityThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.deleteRoomAmenity(id).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getRoomAmenities(filters));
          successHandler("Room Amenity deleted successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}
