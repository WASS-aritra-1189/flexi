import { createSlice } from "@reduxjs/toolkit";
import { setUploading, setLoading } from "./loaderSlice";
import { services } from "../../shared/_services/api_services";
import { errorHandler, successHandler } from "../../shared/_helper/response_helper";

const initialState = {
  poolDetails: null,
  poolTransactions: [],
  poolTransactionsCount: 0,
  allTransactions: [],
  allTransactionsCount: 0,
  usersWithPoints: [],
  usersWithPointsCount: 0,
  selectedUserPoints: null,
};

const rewardPoolSlice = createSlice({
  name: "rewardPool",
  initialState,
  reducers: {
    setPoolDetails: (state, action) => {
      state.poolDetails = action.payload;
    },
    setPoolTransactions: (state, action) => {
      state.poolTransactions = action.payload.result;
      state.poolTransactionsCount = action.payload.total;
    },
    setAllTransactions: (state, action) => {
      state.allTransactions = action.payload.result;
      state.allTransactionsCount = action.payload.total;
    },
    setUsersWithPoints: (state, action) => {
      state.usersWithPoints = action.payload.result;
      state.usersWithPointsCount = action.payload.total;
    },
    setSelectedUserPoints: (state, action) => {
      state.selectedUserPoints = action.payload;
    },
    clearSelectedUserPoints: (state) => {
      state.selectedUserPoints = null;
    },
  },
});

export const {
  setPoolDetails,
  setPoolTransactions,
  setAllTransactions,
  setUsersWithPoints,
  setSelectedUserPoints,
  clearSelectedUserPoints,
} = rewardPoolSlice.actions;

export default rewardPoolSlice.reducer;

// Get pool details
export function fetchPoolDetails() {
  return async function fetchPoolDetailsThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getRewardPoolDetails().then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setPoolDetails(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

// Add points to pool
export function addPointsToPool(points, callback) {
  return async function addPointsToPoolThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.addPointsToPool(points).then(
        (response) => {
          dispatch(setUploading(false));
          successHandler("Points added to pool successfully!");
          dispatch(fetchPoolDetails());
          if (callback) callback();
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

// Distribute points to user
export function distributePointsToUser(payload, filters, callback) {
  return async function distributePointsToUserThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.distributePointsToUser(payload).then(
        (response) => {
          dispatch(setUploading(false));
          successHandler("Points distributed successfully!");
          dispatch(fetchPoolDetails());
          dispatch(fetchUsersWithPoints(filters));
          if (callback) callback();
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

// Deduct points from user
export function deductUserPoints(payload, filters, callback) {
  return async function deductUserPointsThunk(dispatch) {
    dispatch(setUploading(true));
    try {
      await services.deductUserPoints(payload).then(
        (response) => {
          dispatch(setUploading(false));
          successHandler("Points deducted successfully!");
          dispatch(fetchUsersWithPoints(filters));
          dispatch(clearSelectedUserPoints());
          if (callback) callback();
        },
        (error) => {
          dispatch(setUploading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

// Get pool transactions
export function fetchPoolTransactions(payload) {
  return async function fetchPoolTransactionsThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getPoolTransactions(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setPoolTransactions(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

// Get all transactions
export function fetchAllTransactions(payload) {
  return async function fetchAllTransactionsThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getAllRewardTransactions(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setAllTransactions(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

// Get all users with points
export function fetchUsersWithPoints(payload) {
  return async function fetchUsersWithPointsThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getAllUsersWithPoints(payload).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setUsersWithPoints(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}

// Get specific user points
export function fetchUserPointsById(userId) {
  return async function fetchUserPointsByIdThunk(dispatch) {
    dispatch(setLoading(true));
    try {
      await services.getUserPointsById(userId).then(
        (response) => {
          dispatch(setLoading(false));
          dispatch(setSelectedUserPoints(response.data));
        },
        (error) => {
          dispatch(setLoading(false));
          errorHandler(error.response);
        },
      );
    } catch (err) {}
  };
}