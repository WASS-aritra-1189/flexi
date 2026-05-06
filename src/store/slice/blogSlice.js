import { createSlice } from "@reduxjs/toolkit";
import { setLoading, setUploading } from "./loaderSlice";
import { services } from "../../shared/_services/api_services";
import { errorHandler, successHandler } from "../../shared/_helper/response_helper";

const initialState = {
  blogs: [],
  blog: null,
  totalCount: 0,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlogs: (state, { payload }) => {
      state.blogs = payload.result;
      state.totalCount = payload.total;
    },
    setBlog: (state, { payload }) => {
      state.blog = payload;
    },
  },
});

export const { setBlogs, setBlog } = blogSlice.actions;
export default blogSlice.reducer;

export function getBlogs(payload) {
  return async function (dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getAllBlogs(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setBlogs(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function getBlogByIdAction(id) {
  return async function (dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getBlogById(id).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setBlog(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function createBlogAction(payload) {
  return async function (dispatch) {
    dispatch(setUploading(true));
    try {
      await services.createBlog(payload.body).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getBlogs(payload.filters));
          successHandler("Blog created successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function updateBlogAction(payload) {
  return async function (dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateBlog(payload.id, payload.body).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getBlogs(payload.filters));
          successHandler("Blog updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function updateBlogImageAction(payload) {
  return async function (dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateBlogImage(payload.id, payload.formData).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getBlogs(payload.filters));
          successHandler("Blog image updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function updateBlogStatusAction(payload) {
  return async function (dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateBlogStatus(payload.id, payload.body).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getBlogs(payload.filters));
          successHandler("Blog status updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}
