import { createSlice } from "@reduxjs/toolkit";
import { setLoading } from "./loaderSlice";
import { services } from "../../shared/_services/api_services";
import { errorHandler } from "../../shared/_helper/response_helper";

const paymentSlice = createSlice({
  name: "payment",
  initialState: { payments: [], total: 0 },
  reducers: {
    setPayments: (state, { payload }) => {
      state.payments = payload.result;
      state.total = payload.total;
    },
  },
});

export const { setPayments } = paymentSlice.actions;
export default paymentSlice.reducer;

export function fetchAllPayments(payload) {
  return async function (dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getAllPayments(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setPayments(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        }
      );
    } catch (err) {}
  };
}
