import axios from "axios";
import { authHeader } from "../_helper/auth-header";

const RootURL = "https://apiserver.flexitrip.in/api/v1/";

const authUrl = `${RootURL}auth`;
const accountURL = `${RootURL}account`;
const policyURL = `${RootURL}pages`;
const faqURL = `${RootURL}faqs`;
const stateURL = `${RootURL}state`;
const cityURL = `${RootURL}city`;
const propertyTypeURL = `${RootURL}property-type`;
const propertAmenityURL = `${RootURL}property-amenity`;
const RoomUrl = `${RootURL}room`;
const cancelationPolicyURL = `${RootURL}booking-cancel-policy`;
const propertyRuleURL = `${RootURL}property-rule-policy`;
const ticketURL = `${RootURL}ticket`;
const currencyURL = `${RootURL}currency`;
const languageURL = `${RootURL}languages`;
const commissionURL = `${RootURL}commission`;
const blogURL = `${RootURL}blogs`;
const notificationURL = `${RootURL}notifications`;
const propertyPartnerURL = `${RootURL}user-property`;
const travelPartnerURL = `${RootURL}travel-partner`;
const curatedExplorationURL = `${RootURL}curated-exploration`;
const paymentHistoryURL = `${RootURL}payment-history`;
const dashboardURL = `${RootURL}dashboard`;

const login = (credentials) => {
  return axios.post(`${authUrl}/admin/login`, credentials);
};

const vendorList = async (payload) => {
  const { limit, offset, keyword, status } = payload;
  return axios.get(
    `${accountURL}/vendor-list?limit=${limit}&offset=${offset}&keyword=${keyword}&status=${status}`,
    { headers: await authHeader() },
  );
};

const changeVendorStatus = async (payload) => {
  const { accountId, status } = payload;
  return axios.put(
    `${accountURL}/status/${accountId}`,
    { status },
    { headers: await authHeader() },
  );
};

// const getVendorById = async (id) => {
//   return axios.get(
//     `${accountURL}/vendor/${id}`,
//     { headers: await authHeader() },
//   );
// };

const userList = async (payload) => {
  const { limit, offset, keyword, status } = payload;
  return axios.get(
    `${accountURL}/user-list?limit=${limit}&offset=${offset}&keyword=${keyword}&status=${status}`,
    { headers: await authHeader() },
  );
};

const getVendorDetail = async (id) => {
  return axios.get(`${accountURL}/vendor-detail/${id}`, { headers: await authHeader() });
};

const updateVendorDetails = async (id, payload) => {
  const params = new URLSearchParams();
  Object.entries(payload).forEach(([k, v]) => { if (v !== undefined && v !== null) params.append(k, v); });
  return axios.patch(
    `${RootURL}vendor-details/edit/${id}`,
    params.toString(),
    { headers: { ...(await authHeader()), 'Content-Type': 'application/x-www-form-urlencoded' } },
  );
};

// policy
const getAllPolicy = async (payload) => {
  const { limit, offset } = payload;
  return axios.get(`${policyURL}/all?limit=${limit}&offset=${offset}`);
};

const updatePolicy = async (id, payload) => {
  return axios.patch(`${policyURL}/${id}`, payload, {
    headers: await authHeader(),
  });
};

// faq
const getAllFaq = async (payload) => {
  const { limit, offset, keyword, status } = payload;
  return axios.get(
    `${faqURL}/list?limit=${limit}&offset=${offset}&keyword=${keyword}&status=${status}`,
    { headers: await authHeader() },
  );
};

const createFaq = async (payload) => {
  return axios.post(`${faqURL}`, payload, {
    headers: await authHeader(),
  });
};

const updateFaq = async (id, payload) => {
  return axios.patch(`${faqURL}/update/${id}`, payload, {
    headers: await authHeader(),
  });
};

const changeFaqStatus = async (id, payload) => {
  return axios.put(`${faqURL}/status/${id}`, payload, {
    headers: await authHeader(),
  });
};

const updateFaqImage = async (id, formData) => {
  return axios.put(`${faqURL}/image/${id}`, formData, {
    headers: { ...(await authHeader()), "Content-Type": "multipart/form-data" },
  });
};

// state
const createState = async (payload) => {
  return axios.post(`${stateURL}`, payload, {
    headers: await authHeader(),
  });
};

const getAllState = async (payload) => {
  const { limit, offset, keyword, status } = payload;
  return axios.get(
    `${stateURL}/list?limit=${limit}&offset=${offset}&keyword=${keyword}&status=${status}`,
    {
      headers: await authHeader(),
    },
  );
};
const updateState = async (id, payload) => {
  return axios.patch(`${stateURL}/${id}`, payload, {
    headers: await authHeader(),
  });
};
const changeStateStatus = async (id, payload) => {
  return axios.put(`${stateURL}/status/${id}`, payload, {
    headers: await authHeader(),
  });
};

// city
const createCity = async (payload) => {
  return axios.post(`${cityURL}`, payload, {
    headers: await authHeader(),
  });
};

const getAllCity = async (payload) => {
  const { limit, offset, keyword, status, stateId } = payload;
  return axios.get(
    `${cityURL}/list?limit=${limit}&offset=${offset}&keyword=${keyword}&status=${status}&stateId=${stateId}`,
    {
      headers: await authHeader(),
    },
  );
};
const updateCity = async (id, payload) => {
  return axios.patch(`${cityURL}/${id}`, payload, {
    headers: await authHeader(),
  });
};

const changeCityStatus = async (id, payload) => {
  return axios.put(`${cityURL}/status/${id}`, payload, {
    headers: await authHeader(),
  });
};

//property Type
const createPropertyType = async (payload) => {
  return axios.post(`${propertyTypeURL}`, payload, {
    headers: { ...(await authHeader()), "Content-Type": "multipart/form-data" },
  });
};

const getAllPropertyType = async (payload) => {
  const { limit, offset, keyword, status } = payload;
  return axios.get(
    `${propertyTypeURL}/list?limit=${limit}&offset=${offset}&keyword=${keyword}`,
    {
      headers: await authHeader(),
    },
  );
};

const updatePropertyType = async (id, payload) => {
  return axios.patch(`${propertyTypeURL}/update/${id}`, payload, {
    headers: { ...(await authHeader()), "Content-Type": "multipart/form-data" },
  });
};

const deletePropertyType = async (id) => {
  return axios.delete(`${propertyTypeURL}/remove/${id}`, {
    headers: await authHeader(),
  });
};

//property-amenity
const createPropertyAmenity = async (payload) => {
  return axios.post(`${propertAmenityURL}`, payload, {
    headers: { ...(await authHeader()), "Content-Type": "multipart/form-data" },
  });
};
const getAllPropertyAmenity = async (payload) => {
  const { limit, offset, keyword, status } = payload;
  return axios.get(
    `${propertAmenityURL}/list?limit=${limit}&offset=${offset}&keyword=${keyword}`,
    {
      headers: await authHeader(),
    },
  );
};
const updatePropertyAmenity = async (id, payload) => {
  return axios.patch(`${propertAmenityURL}/update/${id}`, payload, {
    headers: await authHeader(),
  });
};
const deletePropertyAmenity = async (id) => {
  return axios.delete(`${propertAmenityURL}/remove/${id}`, {
    headers: await authHeader(),
  });
};

//room-type
const createRoomType = async (payload) => {
  return axios.post(`${RoomUrl}-type`, payload, {
    headers: await authHeader(),
  });
};
const getAllRoomType = async (payload) => {
  const { limit, offset, keyword } = payload;
  return axios.get(
    `${RoomUrl}-type/list?limit=${limit}&offset=${offset}&keyword=${keyword}`,
    {
      headers: await authHeader(),
    },
  );
};
const updateRoomType = async (id, payload) => {
  return axios.patch(`${RoomUrl}-type/update/${id}`, payload, {
    headers: await authHeader(),
  });
};

const updateRoomTypeIcon = async (id, formData) => {
  return axios.put(`${RoomUrl}-type/icon/${id}`, formData, {
    headers: { ...(await authHeader()), "Content-Type": "multipart/form-data" },
  });
};
const deleteRoomType = async (id) => {
  return axios.delete(`${RoomUrl}-type/remove/${id}`, {
    headers: await authHeader(),
  });
};

//room-amenity
const createRoomAmenity = async (payload) => {
  return axios.post(`${RoomUrl}-amenity`, payload, {
    headers: { ...(await authHeader()), "Content-Type": "multipart/form-data" },
  });
};
const getAllRoomAmenity = async (payload) => {
  const { limit, offset, keyword } = payload;
  return axios.get(
    `${RoomUrl}-amenity/list?limit=${limit}&offset=${offset}&keyword=${keyword}`,
    {
      headers: await authHeader(),
    },
  );
};
const updateRoomAmenity = async (id, payload) => {
  return axios.patch(`${RoomUrl}-amenity/update/${id}`, payload, {
    headers: await authHeader(),
  });
};
const deleteRoomAmenity = async (id) => {
  return axios.delete(`${RoomUrl}-amenity/remove/${id}`, {
    headers: await authHeader(),
  });
};

//Cancelation Policy
const createCancelationPolicy = async (payload) => {
  return axios.post(`${cancelationPolicyURL}`, payload, {
    headers: await authHeader(),
  });
};

const getCancelationPolicy = async (payload) => {
  const { limit, offset, keyword } = payload;
  return axios.get(
    `${cancelationPolicyURL}/list?limit=${limit}&offset=${offset}&keyword=${keyword}`,
    {
      headers: await authHeader(),
    },
  );
};

const updateCancelationPolicy = async (id, payload) => {
  return axios.patch(`${cancelationPolicyURL}/update/${id}`, payload, {
    headers: await authHeader(),
  });
};

const deleteCancelationPolicy = async (id) => {
  return axios.delete(`${cancelationPolicyURL}/remove/${id}`, {
    headers: await authHeader(),
  });
};

//Property  Rules
const createPropertyRules = async (payload) => {
  return axios.post(`${propertyRuleURL}`, payload, {
    headers: await authHeader(),
  });
};

const getPropertyRules = async (payload) => {
  const { limit, offset, keyword } = payload;
  return axios.get(
    `${propertyRuleURL}/list?limit=${limit}&offset=${offset}&keyword=${keyword}`,
    {
      headers: await authHeader(),
    },
  );
};

const updatePropertyRules = async (id, payload) => {
  return axios.patch(`${propertyRuleURL}/update/${id}`, payload, {
    headers: await authHeader(),
  });
};

const deletePropertyRules = async (id) => {
  return axios.delete(`${propertyRuleURL}/remove/${id}`, {
    headers: await authHeader(),
  });
};

// currency
const createCurrency = async (payload) => {
  return axios.post(`${currencyURL}`, payload, {
    headers: await authHeader(),
  });
};

const getAllCurrency = async (payload) => {
  const { limit, offset, keyword, status } = payload;
  return axios.get(
    `${currencyURL}/list?limit=${limit}&offset=${offset}&keyword=${keyword}&status=${status}`,
    { headers: await authHeader() },
  );
};

const updateCurrency = async (id, payload) => {
  return axios.patch(`${currencyURL}/update/${id}`, payload, {
    headers: await authHeader(),
  });
};

const deleteCurrency = async (id) => {
  return axios.delete(`${currencyURL}/remove/${id}`, {
    headers: await authHeader(),
  });
};

// language
const createLanguage = async (payload) => {
  return axios.post(`${languageURL}`, payload, {
    headers: await authHeader(),
  });
};

const getAllLanguage = async (payload) => {
  const { limit, offset, keyword, status } = payload;
  return axios.get(
    `${languageURL}/list?limit=${limit}&offset=${offset}&keyword=${keyword}&status=${status}`,
    { headers: await authHeader() },
  );
};

const updateLanguage = async (id, payload) => {
  return axios.patch(`${languageURL}/update/${id}`, payload, {
    headers: await authHeader(),
  });
};

const deleteLanguage = async (id) => {
  return axios.delete(`${languageURL}/remove/${id}`, {
    headers: await authHeader(),
  });
};

// commission
const createCommission = async (payload) => {
  return axios.post(`${commissionURL}`, payload, {
    headers: await authHeader(),
  });
};

const getAllCommission = async (payload) => {
  const { limit, offset, keyword, status } = payload;
  return axios.get(
    `${commissionURL}/list?limit=${limit}&offset=${offset}&keyword=${keyword}&status=${status}`,
    { headers: await authHeader() },
  );
};

const updateCommission = async (id, payload) => {
  return axios.patch(`${commissionURL}/update/${id}`, payload, {
    headers: await authHeader(),
  });
};

const deleteCommission = async (id) => {
  return axios.delete(`${commissionURL}/remove/${id}`, {
    headers: await authHeader(),
  });
};

// blog
const getAllBlogs = async (payload) => {
  const { limit, offset, keyword, status } = payload;
  const params = new URLSearchParams({ limit, offset, keyword });
  if (status) params.append("status", status);
  return axios.get(`${blogURL}/all?${params.toString()}`, {
    headers: await authHeader(),
  });
};

const getBlogById = async (id) => {
  return axios.get(`${blogURL}/${id}`, { headers: await authHeader() });
};

const createBlog = async (payload) => {
  return axios.post(`${blogURL}`, payload, { headers: await authHeader() });
};

const updateBlog = async (id, payload) => {
  return axios.patch(`${blogURL}/${id}`, payload, {
    headers: await authHeader(),
  });
};

const updateBlogImage = async (id, formData) => {
  return axios.put(`${blogURL}/image/${id}`, formData, {
    headers: { ...(await authHeader()), "Content-Type": "multipart/form-data" },
  });
};

const updateBlogStatus = async (id, payload) => {
  return axios.put(`${blogURL}/status/${id}`, payload, {
    headers: await authHeader(),
  });
};

// ticket
const getTicket = async (payload) => {
  const { limit, offset, keyword, status } = payload;
  return axios.get(
    `${ticketURL}/admin/list?limit=${limit}&offset=${offset}&keyword=${keyword}&status=${status}`,
    { headers: await authHeader() },
  );
};

const updateTicketStatus = async (id, payload) => {
  return axios.put(`${ticketURL}/status/${id}`, payload, {
    headers: await authHeader(),
  });
};

// notification
const createNotification = async (payload) => {
  return axios.post(`${notificationURL}/single`, payload, {
    headers: await authHeader(),
  });
};

const getNotifications = async (payload) => {
  const { limit, offset } = payload;
  return axios.get(`${notificationURL}/list?limit=${limit}&offset=${offset}`, {
    headers: await authHeader(),
  });
};

const updateNotification = async (id, payload) => {
  return axios.patch(`${notificationURL}/update/${id}`, payload, {
    headers: await authHeader(),
  });
};

const deleteNotification = async (id) => {
  return axios.delete(`${notificationURL}/remove/${id}`, {
    headers: await authHeader(),
  });
};

// partners
const getAllPropertyPartners = async (payload) => {
  const { limit, offset, keyword } = payload;
  return axios.get(`${propertyPartnerURL}/list?limit=${limit}&offset=${offset}&keyword=${keyword}`, {
    headers: await authHeader(),
  });
};

const getAllTravelPartners = async (payload) => {
  const { limit, offset, keyword } = payload;
  return axios.get(`${travelPartnerURL}/list?limit=${limit}&offset=${offset}&keyword=${keyword}`, {
    headers: await authHeader(),
  });
};

// curated exploration
const getAllCuratedExplorations = async (payload) => {
  const { limit, offset, keyword } = payload;
  return axios.get(`${curatedExplorationURL}/list?limit=${limit}&offset=${offset}&keyword=${keyword}`, {
    headers: await authHeader(),
  });
};

const createCuratedExploration = async (formData) => {
  return axios.post(`${curatedExplorationURL}`, formData, {
    headers: { ...(await authHeader()), "Content-Type": "multipart/form-data" },
  });
};

const updateCuratedExploration = async (id, formData) => {
  return axios.patch(`${curatedExplorationURL}/update/${id}`, formData, {
    headers: { ...(await authHeader()), "Content-Type": "multipart/form-data" },
  });
};

const deleteCuratedExploration = async (id) => {
  return axios.delete(`${curatedExplorationURL}/remove/${id}`, {
    headers: await authHeader(),
  });
};

// booking history
const getUserBookingHistory = async (userId, payload) => {
  const { limit, offset, status } = payload;
  return axios.get(
    `${RootURL}book-room/admin/list/${userId}?limit=${limit}&offset=${offset}&status=${status}`,
    { headers: await authHeader() },
  );
};

// payment history
const getUserPaymentHistory = async (userId, payload) => {
  const { limit, offset, keyword } = payload;
  return axios.get(
    `${paymentHistoryURL}/admin/list/${userId}?limit=${limit}&offset=${offset}&keyword=${keyword}`,
    { headers: await authHeader() },
  );
};

const getAllPayments = async (payload) => {
  const { limit, offset, keyword } = payload;
  return axios.get(
    `${paymentHistoryURL}/all-payments?limit=${limit}&offset=${offset}&keyword=${keyword}`,
    { headers: await authHeader() },
  );
};

// dashboard stats
const getDashboardStats = async () => {
  return axios.get(`${dashboardURL}/stats`, { headers: await authHeader() });
};

const getVendorStats = async (vendorId) => {
  return axios.get(`${dashboardURL}/vendor-wise-stats/${vendorId}`, { headers: await authHeader() });
};

const bookRoomURL = `${RootURL}book-room`;

const propertyURL = `${RootURL}property`;

const getVendorProperties = async (vendorId, payload) => {
  const { limit, offset, status, keyword } = payload;
  return axios.get(
    `${propertyURL}/admin/list/${vendorId}?limit=${limit}&offset=${offset}&status=${status}&keyword=${keyword}`,
    { headers: await authHeader() },
  );
};

// ediary
const ediaryURL = `${RootURL}ediary`;

const getAllEdiary = async (payload) => {
  const { limit, offset, keyword } = payload;
  return axios.get(`${ediaryURL}/all?limit=${limit}&offset=${offset}&keyword=${keyword}`, {
    headers: await authHeader(),
  });
};

const getEdiaryDetail = async (id) => {
  return axios.get(`${ediaryURL}/detail/${id}`, { headers: await authHeader() });
};

const getEdiaryLikes = async (id) => {
  return axios.get(`${RootURL}ediary-like/list/${id}`, { headers: await authHeader() });
};

const deleteEdiary = async (id) => {
  return axios.delete(`${ediaryURL}/delete/${id}`, { headers: await authHeader() });
};

// bookings
const getAllBookings = async (vendorId, payload) => {
  const { limit, offset, status } = payload;
  return axios.get(
    `${bookRoomURL}/admin/list/${vendorId}?limit=${limit}&offset=${offset}&status=${status}`,
    { headers: await authHeader() },
  );
};

const updateBooking = async (id, payload) => {
  const params = new URLSearchParams();
  Object.entries(payload).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') params.append(k, v); });
  return axios.patch(
    `${bookRoomURL}/update-booking/${id}`,
    params.toString(),
    { headers: { ...(await authHeader()), 'Content-Type': 'application/x-www-form-urlencoded' } },
  );
};

const updateBookingStatus = async (id, status) => {
  const params = new URLSearchParams({ status });
  return axios.patch(
    `${bookRoomURL}/admin/status/${id}`,
    params.toString(),
    { headers: { ...(await authHeader()), 'Content-Type': 'application/x-www-form-urlencoded' } },
  );
};

const addBookingPayment = async (id, amount) => {
  const params = new URLSearchParams({ amount });
  return axios.patch(
    `${bookRoomURL}/admin/due/${id}`,
    params.toString(),
    { headers: { ...(await authHeader()), 'Content-Type': 'application/x-www-form-urlencoded' } },
  );
};

export const services = {
  //auth services
  login,

  // account services
  vendorList,
  changeVendorStatus,
  // getVendorById, // Commented until backend ready
  userList,
  getVendorDetail,
  updateVendorDetails,

  // policy services
  getAllPolicy,
  updatePolicy,

  // faq services
  getAllFaq,
  createFaq,
  updateFaq,
  changeFaqStatus,
  updateFaqImage,

  //state
  createState,
  getAllState,
  updateState,
  changeStateStatus,

  // city
  createCity,
  getAllCity,
  updateCity,
  changeCityStatus,

  // property Type
  createPropertyType,
  getAllPropertyType,
  updatePropertyType,
  deletePropertyType,

  // property Amenity
  createPropertyAmenity,
  getAllPropertyAmenity,
  updatePropertyAmenity,
  deletePropertyAmenity,
  // room Type
  createRoomType,
  getAllRoomType,
  updateRoomType,
  updateRoomTypeIcon,
  deleteRoomType,

  // room Amenity
  createRoomAmenity,
  getAllRoomAmenity,
  updateRoomAmenity,
  deleteRoomAmenity,

  // cancelation Policy
  createCancelationPolicy,
  getCancelationPolicy,
  updateCancelationPolicy,
  deleteCancelationPolicy,

  // property Rules
  createPropertyRules,
  getPropertyRules,
  updatePropertyRules,
  deletePropertyRules,

  // currency
  createCurrency,
  getAllCurrency,
  updateCurrency,
  deleteCurrency,

  // language
  createLanguage,
  getAllLanguage,
  updateLanguage,
  deleteLanguage,

  // commission
  createCommission,
  getAllCommission,
  updateCommission,
  deleteCommission,

  // blog
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  updateBlogImage,
  updateBlogStatus,

  //Ticket
  getTicket,
  updateTicketStatus,

  // notification
  createNotification,
  getNotifications,
  updateNotification,
  deleteNotification,

  // partners
  getAllPropertyPartners,
  getAllTravelPartners,

  // curated exploration
  getAllCuratedExplorations,
  createCuratedExploration,
  updateCuratedExploration,
  deleteCuratedExploration,

  // booking history
  getUserBookingHistory,

  // payment history
  getUserPaymentHistory,
  getAllPayments,

  // dashboard
  getDashboardStats,
  getVendorStats,

  // vendor properties
  getVendorProperties,

  // ediary
  getAllEdiary,
  getEdiaryDetail,
  getEdiaryLikes,
  deleteEdiary,

  // bookings
  getAllBookings,
  updateBooking,
  updateBookingStatus,
  addBookingPayment,
};
