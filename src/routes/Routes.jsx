import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/auth/login/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/profile/Profile";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import TripManagement from "../pages/trip-management/TripManagement";
import BookingManagement from "../pages/booking-management/BookingManagement";
import UserManagement from "../pages/user-management/UserManagement";
import Settings from "../pages/settings/Settings";
import AddTrip from "../pages/trip-management/AddTrip";
import TripCategories from "../pages/trip-management/TripCategories";
import PendingBookings from "../pages/booking-management/PendingBookings";
import ConfirmedBookings from "../pages/booking-management/ConfirmedBookings";
import BookingReports from "../pages/reports/BookingReports";
import RevenueReports from "../pages/reports/RevenueReports";
import UserReports from "../pages/reports/UserReports";
import Faq from "../pages/faq-management/Faq";
import State from "../pages/location-management/State";
import City from "../pages/location-management/City";
import PropertyType from "../pages/property-management/PropertyType";
import PropertyAmenity from "../pages/property-management/PropertyAmenity";
import RoomType from "../pages/room-management/RoomType";
import RoomAmenity from "../pages/room-management/RoomAmenity";
import CancelationPolicy from "../pages/policy-management/CancelationPolicy";
import PropertyRule from "../pages/policy-management/PropertyRule";
import Policy from "../pages/policy-management/Policy";
import PageManagement from "../pages/policy-management/PageManagement";
import AccountVendor from "../pages/vendors/AccountVendor";
import AccountVendorDetails from "../pages/vendors/AccountVendorDetails";
import Currency from "../pages/currency-management/Currency";
import Language from "../pages/language-management/Language";
import Commission from "../pages/commission-management/Commission";
import AllProperties from "../pages/all-properties/AllProperties";
import PropertyDetails from "../pages/all-properties/PropertyDetails";
import Blog from "../pages/blog-management/Blog";
import ContactUs from "../pages/contact-us/ContactUs";
import BlogCreate from "../pages/blog-management/BlogCreate";
import BlogDetails from "../pages/blog-management/BlogDetails";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <PublicRoute />,
        children: [
            { path: "", element: <Navigate to="/login" replace /> },
            { path: "login", element: <Login /> }
        ]
    },
    {
        path: "/",
        element: <PrivateRoute />,
        children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "profile", element: <Profile /> },
            { path: "trips", element: <TripManagement /> },
            { path: "trips/add", element: <AddTrip /> },
            { path: "trips/categories", element: <TripCategories /> },
            { path: "bookings", element: <BookingManagement /> },
            { path: "bookings/pending", element: <PendingBookings /> },
            { path: "bookings/confirmed", element: <ConfirmedBookings /> },
            { path: "users", element: <UserManagement /> },
            { path: "reports/bookings", element: <BookingReports /> },
            { path: "reports/revenue", element: <RevenueReports /> },
            { path: "reports/users", element: <UserReports /> },
            { path: "settings", element: <Settings /> },
            { path: "vendors", element: <AccountVendor /> },
            { path: "vendors/:id", element: <AccountVendorDetails /> },
            { path: "faqs", element: <Faq /> },
            { path: "states", element: <State /> },
            { path: "cities", element: <City /> },
            { path: "property-type", element: <PropertyType /> },
            { path: "property-amenity", element: <PropertyAmenity /> },
            { path: "room-type", element: <RoomType /> },
            { path: "room-amenity", element: <RoomAmenity /> },
            { path: "cancellation-policy", element: <CancelationPolicy /> },
            { path: "property-rules", element: <PropertyRule /> },
            { path: "policies", element: <Policy /> },
            { path: "page-management", element: <PageManagement /> },
            { path: "currencies", element: <Currency /> },
            { path: "languages", element: <Language /> },
            { path: "commissions", element: <Commission /> },
            { path: "all-properties", element: <AllProperties /> },
            { path: "all-properties/details", element: <PropertyDetails /> },
            { path: "blogs", element: <Blog /> },
            { path: "blogs/create", element: <BlogCreate /> },
            { path: "blogs/details", element: <BlogDetails /> },
            { path: "contact-us", element: <ContactUs /> },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);

export default routes;