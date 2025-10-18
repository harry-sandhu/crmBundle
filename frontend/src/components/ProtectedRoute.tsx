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
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";

// export default function ProtectedRoute() {
//   const [loading, setLoading] = useState(true);
//   const [ok, setOk] = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userInfo = localStorage.getItem("userInfo");
//     // Accept either plain JSON string or accidental prefixed text; try to parse safely
//     let parsedOk = false;
//     if (token && userInfo) {
//       try {
//         // If someone stored 'userInfo {"id":"..."}' as a single string, extract JSON part:
//         const jsonStart = userInfo.indexOf("{");
//         const jsonStr = jsonStart >= 0 ? userInfo.slice(jsonStart) : userInfo;
//         JSON.parse(jsonStr);
//         parsedOk = true;
//       } catch {
//         parsedOk = false;
//       }
//     }
//     setOk(Boolean(token) && parsedOk);
//     setLoading(false);
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen text-green-700 font-semibold">
//         Checking access...
//       </div>
//     );
//   }

//   if (!ok) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   return <Outlet />;
// }

// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useMemo, useState, useEffect } from "react";

// type StoredUser = {
//   id: string;
//   name: string;
//   email: string;
//   role: "user" | "admin";
//   refCode: string;
// };

// const ADMIN_EMAIL = "growlifesupremo2025@gmail.com";

// export default function ProtectedRoute() {
//   const location = useLocation();
//   const [storageError, setStorageError] = useState(false);

//   // Synchronous auth snapshot to avoid first-render race conditions
//   const { isAuthed, user } = useMemo(() => {
//     try {
//       const token = localStorage.getItem("token");
//       const raw = localStorage.getItem("userInfo");
//       if (!token || !raw) return { isAuthed: false, user: null as StoredUser | null };

//       // Be strict: expect valid JSON, not prefixed strings
//       const parsed = JSON.parse(raw) as StoredUser;
//       const ok =
//         typeof parsed?.email === "string" &&
//         typeof parsed?.id === "string" &&
//         typeof parsed?.name === "string";
//       if (!ok) return { isAuthed: false, user: null };

//       return { isAuthed: true, user: parsed };
//     } catch {
//       return { isAuthed: false, user: null };
//     }
//   }, []);

//   // Optional: detect storage exceptions to display a loader briefly
//   useEffect(() => {
//     try {
//       // Touch storage to surface potential quota or access errors
//       void localStorage.length;
//     } catch {
//       setStorageError(true);
//       const t = setTimeout(() => setStorageError(false), 300);
//       return () => clearTimeout(t);
//     }
//   }, []);

//   if (storageError) {
//     return (
//       <div className="flex items-center justify-center h-screen text-green-700 font-semibold">
//         Checking access...
//       </div>
//     );
//   }

//   // Not authenticated → send to login with return-to
//   if (!isAuthed) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   // Admin-only gate for /admin by exact email match
//   if (location.pathname.startsWith("/admin")) {
//     const email = (user?.email || "").toLowerCase();
//     if (email !== ADMIN_EMAIL.toLowerCase()) {
//       // If a non-admin tried to access /admin, send them somewhere safe
//       return <Navigate to="/dashboard" replace />;
//     }
//   }

//   return <Outlet />;
// }


import { Navigate, Outlet, useLocation } from "react-router-dom";
type StoredUser = { id: string; name: string; email: string; role: "user" | "admin"; refCode: string };

const ADMIN_EMAIL = "growlifesupremo2025@gmail.com";

function readAuth(): { isAuthed: boolean; user: StoredUser | null } {
  const token = localStorage.getItem("token");
  const raw = localStorage.getItem("userInfo");
  if (!token || !raw) return { isAuthed: false, user: null };
  try {
    const parsed = JSON.parse(raw) as StoredUser;
    if (!parsed?.email || !parsed?.id) return { isAuthed: false, user: null };
    parsed.email = parsed.email.toLowerCase();
    return { isAuthed: true, user: parsed };
  } catch {
    return { isAuthed: false, user: null };
  }
}

export default function ProtectedRoute() {
  const location = useLocation();
  const { isAuthed, user } = readAuth(); // sync snapshot, no loading race

  if (!isAuthed) {
    // Keep login/register pages public; otherwise send to login with return-to
    if (location.pathname === "/login" || location.pathname === "/register") {
      return <Outlet />;
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Admin-only: allow only the specific email into /admin
  if (location.pathname.startsWith("/admin")) {
    if ((user?.email || "") !== ADMIN_EMAIL) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}
