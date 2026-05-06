import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const token = localStorage.getItem('token');

    return !isAuthenticated && !token ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;