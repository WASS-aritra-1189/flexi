import { createSlice } from "@reduxjs/toolkit";
import { setLoading } from "./loaderSlice";
import { services } from "../../shared/_services/api_services";
import { errorHandler } from "../../shared/_helper/response_helper";

const initialState = {
  propertyPartners: [],
  propertyPartnerTotal: 0,
  travelPartners: [],
  travelPartnerTotal: 0,
};

const partnerSlice = createSlice({
  name: "partner",
  initialState,
  reducers: {
    setPropertyPartners: (state, { payload }) => {
      state.propertyPartners = payload.result;
      state.propertyPartnerTotal = payload.total;
    },
    setTravelPartners: (state, { payload }) => {
      state.travelPartners = payload.result;
      state.travelPartnerTotal = payload.total;
    },
  },
});

export const { setPropertyPartners, setTravelPartners } = partnerSlice.actions;
export default partnerSlice.reducer;

export function getPropertyPartners(payload) {
  return async function (dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getAllPropertyPartners(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setPropertyPartners(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        }
      );
    } catch (err) {}
  };
}

export function getTravelPartners(payload) {
  return async function (dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getAllTravelPartners(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setTravelPartners(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        }
      );
    } catch (err) {}
  };
}
