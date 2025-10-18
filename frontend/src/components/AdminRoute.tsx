// src/components/AdminRoute.tsx
import { Navigate, useLocation } from "react-router-dom";

type StoredUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  refCode: string;
};

const ADMIN_EMAIL = "growlifesupremo2025@gmail.com";

function readAuth(): { authed: boolean; email: string | null } {
  try {
    const token = localStorage.getItem("token");
    const raw = localStorage.getItem("userInfo");
    if (!token || !raw) return { authed: false, email: null };
    const parsed = JSON.parse(raw) as StoredUser;
    const email = (parsed?.email || "").toLowerCase();
    if (!email) return { authed: false, email: null };
    return { authed: true, email };
  } catch {
    return { authed: false, email: null };
  }
}

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { authed, email } = readAuth(); // synchronous snapshot

  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (email !== ADMIN_EMAIL.toLowerCase()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
