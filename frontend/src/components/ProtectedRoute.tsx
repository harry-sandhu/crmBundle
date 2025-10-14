// import { Navigate, useLocation } from "react-router-dom";
// import { type ReactNode, useEffect, useState } from "react";

// interface ProtectedRouteProps {
//   children: ReactNode;
//   role?: "user" | "admin";
// }

// export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userData = localStorage.getItem("userInfo");

//     if (!token || !userData) {
//       setIsAuthorized(false);
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const user = JSON.parse(userData);
//       // ✅ Default role to user if missing
//       const userRole = user?.role?.toLowerCase?.() || "user";

//       if (role && userRole !== role) {
//         setIsAuthorized(false);
//       } else {
//         setIsAuthorized(true);
//       }
//     } catch {
//       setIsAuthorized(false);
//     }

//     setIsLoading(false);
//   }, [role]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen text-green-700 font-semibold">
//         Checking access...
//       </div>
//     );
//   }

//   if (!isAuthorized) {
//     return <Navigate to="/" state={{ from: location }} replace />;
//   }

//   return <>{children}</>;
// }

// src/components/ProtectedRoute.tsx

// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");
    // Accept either plain JSON string or accidental prefixed text; try to parse safely
    let parsedOk = false;
    if (token && userInfo) {
      try {
        // If someone stored 'userInfo {"id":"..."}' as a single string, extract JSON part:
        const jsonStart = userInfo.indexOf("{");
        const jsonStr = jsonStart >= 0 ? userInfo.slice(jsonStart) : userInfo;
        JSON.parse(jsonStr);
        parsedOk = true;
      } catch {
        parsedOk = false;
      }
    }
    setOk(Boolean(token) && parsedOk);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-green-700 font-semibold">
        Checking access...
      </div>
    );
  }

  if (!ok) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
