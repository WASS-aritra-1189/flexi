import { createSlice } from "@reduxjs/toolkit";
import { setUploading, setLoading } from "./loaderSlice";
import { services } from "../../shared/_services/api_services";
import {
  errorHandler,
  successHandler,
} from "../../shared/_helper/response_helper";

const initialState = {
  notifications: [],
  notificationTotalCount: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, { payload }) => {
      state.notifications = payload.result;
      state.notificationTotalCount = payload.total;
    },
  },
});

export const { setNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;

export function getNotifications(payload) {
  return async function getNotificationsThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getNotifications(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setNotifications(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function createNotification(payload) {
  const { body, filters } = payload;
  return async function createNotificationThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.createNotification(body).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getNotifications(filters));
          successHandler("Notification created successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function updateNotificationData(payload) {
  const { id, body, filters } = payload;
  return async function updateNotificationThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateNotification(id, body).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getNotifications(filters));
          successHandler("Notification updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function deleteNotificationData(payload) {
  const { id, filters } = payload;
  return async function deleteNotificationThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.deleteNotification(id).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getNotifications(filters));
          successHandler("Notification deleted successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}
