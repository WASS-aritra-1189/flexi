import { createSlice } from "@reduxjs/toolkit";
import { setUploading, setLoading } from "./loaderSlice";
import { services } from "../../shared/_services/api_services";
import {
  errorHandler,
  successHandler,
} from "../../shared/_helper/response_helper";

const initialState = {
  faqs: [],
  faq: null,
  totalCount: 0,
};

const faqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {
    setFaqs: (state, { payload }) => {
      state.faqs = payload.result;
      state.totalCount = payload.total;
    },
    setFaq: (state, { payload }) => {
      state.faq = payload;
    },
  },
});

export const { setFaqs, setFaq } = faqSlice.actions;

export default faqSlice.reducer;

export function getFaqs(payload) {
  return async function getFaqsThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getAllFaq(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setFaqs(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function createFaq(payload) {
  return async function createFaqThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.createFaq(payload.body).then(
        (response) => {
          dispatch(setUploading(false));
          if (payload.imageFile) {
            const fd = new FormData();
            fd.append('file', payload.imageFile);
            dispatch(uploadFaqImage({ id: response.data.id, formData: fd, filters: payload.filters }));
          } else {
            dispatch(getFaqs(payload.filters));
          }
          successHandler("FAQ created successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function uploadFaqImage(payload) {
  return async function uploadFaqImageThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateFaqImage(payload.id, payload.formData).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getFaqs(payload.filters));
          successHandler("FAQ image uploaded successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function updateFaqData(payload) {
  return async function updateFaqThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateFaq(payload.id, payload.body).then(
        () => {
          dispatch(setUploading(false));
          if (payload.imageFile) {
            const fd = new FormData();
            fd.append('file', payload.imageFile);
            dispatch(uploadFaqImage({ id: payload.id, formData: fd, filters: payload.filters }));
          } else {
            dispatch(getFaqs(payload.filters));
          }
          successHandler("FAQ updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function updateFaqStatus(payload) {
  return async function updateFaqStatusThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.changeFaqStatus(payload.id, payload.body).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getFaqs(payload.filters));
          successHandler("FAQ status updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}
