import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import loaderSlice from "./slice/loaderSlice";
import accountSlice from "./slice/accountSlice";
import faqSlice from "./slice/faqSlice";
import stateSlice from "./slice/stateSlice";
import citySlice from "./slice/citySlice";
import propertyTypeSlice from "./slice/propertyTypeSlice";
import propertyAmenitySlice from "./slice/propertyAmenitySlice";
import roomSlice from "./slice/roomSlice";
import policySlice from "./slice/policySlice";
import currencySlice from "./slice/currencySlice";
import languageSlice from "./slice/languageSlice";
import commissionSlice from "./slice/commissionSlice";
import blogSlice from "./slice/blogSlice";
import notificationSlice from "./slice/notificationSlice";
import partnerSlice from "./slice/partnerSlice";
import curatedExplorationSlice from "./slice/curatedExplorationSlice";
import paymentSlice from "./slice/paymentSlice";
import bookingSlice from "./slice/bookingSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    loader: loaderSlice,
    account: accountSlice,
    faq: faqSlice,
    state: stateSlice,
    city: citySlice,
    propertyType: propertyTypeSlice,
    propertyAmenity: propertyAmenitySlice,
    room: roomSlice,
    policy: policySlice,
    currency: currencySlice,
    language: languageSlice,
    commission: commissionSlice,
    blog: blogSlice,
    notification: notificationSlice,
    partner: partnerSlice,
    curatedExploration: curatedExplorationSlice,
    payment: paymentSlice,
    booking: bookingSlice,
  },
});

export default store;
