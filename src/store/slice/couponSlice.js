import { createSlice } from "@reduxjs/toolkit";
import { setLoading, setUploading } from "./loaderSlice";
import { services } from "../../shared/_services/api_services";
import { errorHandler, successHandler } from "../../shared/_helper/response_helper";

const initialState = {
  coupons: [],
  totalCount: 0,
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    setCoupons: (state, { payload }) => {
      state.coupons = payload.result;
      state.totalCount = payload.total;
    },
  },
});

export const { setCoupons } = couponSlice.actions;
export default couponSlice.reducer;

export function getCoupons(payload) {
  return async function (dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getAllCoupons(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setCoupons(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function createCoupon(payload) {
  return async function (dispatch) {
    dispatch(setUploading(true));
    try {
      await services.createCoupon(payload.formData).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getCoupons(payload.filters));
          successHandler("Coupon created successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function updateCouponData(payload) {
  return async function (dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateCoupon(payload.id, payload.body).then(
        async () => {
          if (payload.imageFile) {
            const fd = new FormData();
            fd.append("file", payload.imageFile);
            await services.updateCouponImage(payload.id, fd);
          }
          dispatch(setUploading(false));
          dispatch(getCoupons(payload.filters));
          successHandler("Coupon updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function deleteCouponData(payload) {
  return async function (dispatch) {
    dispatch(setUploading(true));
    try {
      await services.deleteCoupon(payload.id).then(
        () => {
          dispatch(setUploading(false));
          dispatch(getCoupons(payload.filters));
          successHandler("Coupon deleted successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}
