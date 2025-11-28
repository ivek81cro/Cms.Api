import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export function RequireAuth({ children }: Props) {
    const token = localStorage.getItem("authToken");
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
