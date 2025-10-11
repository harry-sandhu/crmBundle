// src/routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// Layouts
import MainLayout from "../layouts/MainLayout";
import UserLayout from "../layouts/UserLayout";

// Public Pages
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import VerifyOtp from "../pages/Auth/VerifyOtp";
import ForgotPassword from "../pages/Auth/ForgotPassword";

// User Pages
import Catalog from "../pages/Landing/Catalog";
import Dashboard from "../pages/User/Dashboard";
import ReviewSubmit from "../pages/BundleMaker/ReviewSubmit";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🟢 PUBLIC ROUTES */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* 🔒 PROTECTED USER ROUTES */}
        <Route
          element={
            <ProtectedRoute role="user">
              <UserLayout  />
            </ProtectedRoute>
          }
        >
<Route path="/catalog" element={<Catalog />} />


          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bundle/review" element={<ReviewSubmit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
