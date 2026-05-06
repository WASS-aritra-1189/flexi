import { Navigate, Outlet } from "react-router-dom";
import Layout from "../Layout/Layout";

const PrivateRoute = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const token = localStorage.getItem('token');

    return isAuthenticated && token ? (
        <Layout>
            <Outlet />
        </Layout>
    ) : (
        <Navigate to="/" replace />
    );
};

export default PrivateRoute;