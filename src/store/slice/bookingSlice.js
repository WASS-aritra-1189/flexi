import { createSlice } from '@reduxjs/toolkit';
import { setUploading, setLoading } from './loaderSlice';
import { services } from '../../shared/_services/api_services';
import { errorHandler, successHandler } from '../../shared/_helper/response_helper';

const initialState = {
  bookingList: [],
  bookingListCount: 0,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingList: (state, action) => {
      state.bookingList = action.payload.result;
      state.bookingListCount = action.payload.total;
    },
  },
});

export const { setBookingList } = bookingSlice.actions;
export default bookingSlice.reducer;

export function fetchAllBookings(vendorId, payload) {
  return async function (dispatch) {
    dispatch(setLoading(true));
    try {
      const res = await services.getAllBookings(vendorId, payload);
      dispatch(setLoading(false));
      dispatch(setBookingList(res.data));
    } catch (err) {
      dispatch(setLoading(false));
      errorHandler(err.response);
    }
  };
}

export function editBooking(id, payload, vendorId, filters, onDone) {
  return async function (dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateBooking(id, payload);
      dispatch(setUploading(false));
      dispatch(fetchAllBookings(vendorId, filters));
      successHandler('Booking updated successfully!');
      onDone?.();
    } catch (err) {
      dispatch(setUploading(false));
      errorHandler(err.response);
    }
  };
}

export function changeBookingStatus(id, status, vendorId, filters, onDone) {
  return async function (dispatch) {
    dispatch(setUploading(true));
    try {
      await services.updateBookingStatus(id, status);
      dispatch(setUploading(false));
      dispatch(fetchAllBookings(vendorId, filters));
      successHandler('Status updated successfully!');
      onDone?.();
    } catch (err) {
      dispatch(setUploading(false));
      errorHandler(err.response);
    }
  };
}

export function recordBookingPayment(id, amount, vendorId, filters, onDone) {
  return async function (dispatch) {
    dispatch(setUploading(true));
    try {
      await services.addBookingPayment(id, amount);
      dispatch(setUploading(false));
      dispatch(fetchAllBookings(vendorId, filters));
      successHandler('Payment recorded successfully!');
      onDone?.();
    } catch (err) {
      dispatch(setUploading(false));
      errorHandler(err.response);
    }
  };
}
