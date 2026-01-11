import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function RequireAuth() {
    const { status, user } = useAuth();
    const location = useLocation();

    if (status === "loading") {
        return <div style={{ padding: 24 }}>Loading...</div>;
    }

    if (status !== "authenticated" || !user) {
        return (
            <Navigate to="/login" replace state={{ from: location.pathname }} />
        );
    }

    return <Outlet />;
}
