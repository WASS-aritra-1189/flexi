import { createSlice } from "@reduxjs/toolkit";
import { setUploading, setLoading } from "./loaderSlice";
import { services } from "../../shared/_services/api_services";
import {
  errorHandler,
  successHandler,
} from "../../shared/_helper/response_helper";

const initialState = {
  cancelationPolicies: [],
  cancelationPolicyTotalCount: 0,
  propertyRules: [],
  propertyRuleTotalCount: 0,
  policies: [],
  policyTotalCount: 0,
};

const policySlice = createSlice({
  name: "policy",
  initialState,
  reducers: {
    setCancelationPolicies: (state, { payload }) => {
      state.cancelationPolicies = payload.result;
      state.cancelationPolicyTotalCount = payload.total;
    },

    setPropertyRules: (state, { payload }) => {
      state.propertyRules = payload.result;
      state.propertyRuleTotalCount = payload.total;
    },
    setPolicies: (state, { payload }) => {
      state.policies = payload.result;
      state.policyTotalCount = payload.total;
    },
  },
});

export const { setCancelationPolicies, setPropertyRules, setPolicies } = policySlice.actions;

export default policySlice.reducer;

// Cancelation Policy Functions
export function getCancelationPolicies(payload) {
  return async function getCancelationPoliciesThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getCancelationPolicy(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setCancelationPolicies(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function createCancelationPolicy(payload) {
  const { body, filters } = payload;
  return async function createCancelationPolicyThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.createCancelationPolicy(body).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getCancelationPolicies(filters));
          successHandler("Cancelation Policy created successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function updateCancelationPolicyData(payload) {
  const { id, filters, body } = payload;
  return async function updateCancelationPolicyThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateCancelationPolicy(id, body).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getCancelationPolicies(filters));
          successHandler("Cancelation Policy updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function deleteCancelationPolicyData(payload) {
  const { id, filters } = payload;
  return async function deleteCancelationPolicyThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.deleteCancelationPolicy(id).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getCancelationPolicies(filters));
          successHandler("Cancelation Policy deleted successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

// Property Rules Functions
export function getPropertyRules(payload) {
  return async function getPropertyRulesThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getPropertyRules(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setPropertyRules(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function createPropertyRule(payload) {
  const { body, filters } = payload;
  return async function createPropertyRuleThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.createPropertyRules(body).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getPropertyRules(filters));
          successHandler("Property Rule created successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function updatePropertyRuleData(payload) {
  const { id, filters, body } = payload;
  return async function updatePropertyRuleThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updatePropertyRules(id, body).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getPropertyRules(filters));
          successHandler("Property Rule updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function deletePropertyRuleData(payload) {
  const { id, filters } = payload;
  return async function deletePropertyRuleThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.deletePropertyRules(id).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getPropertyRules(filters));
          successHandler("Property Rule deleted successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

// Policy Functions
export function getPolicies(payload) {
  return async function getPoliciesThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getAllPolicy(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setPolicies(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

export function updatePolicyData(payload) {
  const { id, filters, body } = payload;
  return async function updatePolicyThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updatePolicy(id, body).then(
        (response) => {
          dispatch(setUploading(false));
          dispatch(getPolicies(filters));
          successHandler("Policy updated successfully!");
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}
