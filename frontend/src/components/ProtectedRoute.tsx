import { Navigate, useLocation } from "react-router-dom";
import { type ReactNode, useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: "user" | "admin";
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userInfo");

    if (!token || !userData) {
      setIsAuthorized(false);
      setIsLoading(false);
      return;
    }

    try {
      const user = JSON.parse(userData);
      // ✅ Default role to user if missing
      const userRole = user?.role?.toLowerCase?.() || "user";

      if (role && userRole !== role) {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    } catch {
      setIsAuthorized(false);
    }

    setIsLoading(false);
  }, [role]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-green-700 font-semibold">
        Checking access...
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
